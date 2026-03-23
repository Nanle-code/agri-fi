import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentMilestone, MilestoneType } from './entities/shipment-milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { StellarService } from '../stellar/stellar.service';
import { ConfigService } from '@nestjs/config';

const MILESTONE_SEQUENCE: MilestoneType[] = ['farm', 'warehouse', 'port', 'importer'];

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(ShipmentMilestone)
    private readonly milestoneRepo: Repository<ShipmentMilestone>,
    private readonly stellarService: StellarService,
    private readonly config: ConfigService,
  ) {}

  async recordMilestone(
    userId: string,
    dto: CreateMilestoneDto,
  ): Promise<ShipmentMilestone> {
    // Load the deal via raw query to avoid circular entity deps
    const result = await this.milestoneRepo.manager.query(
      `SELECT id, status, trader_id, escrow_secret_key FROM trade_deals WHERE id = $1`,
      [dto.trade_deal_id],
    );

    if (!result.length) {
      throw new NotFoundException('Trade deal not found.');
    }

    const deal = result[0] as {
      id: string;
      status: string;
      trader_id: string;
      escrow_secret_key: string;
    };

    // 5.6 — only funded deals
    if (deal.status !== 'funded') {
      throw new UnprocessableEntityException({
        code: 'DEAL_NOT_FUNDED',
        message: 'Milestones can only be recorded for funded deals.',
      });
    }

    // 5.6 — only the assigned trader
    if (deal.trader_id !== userId) {
      throw new ForbiddenException({
        code: 'NOT_ASSIGNED_TRADER',
        message: 'Only the assigned trader can record milestones for this deal.',
      });
    }

    // 5.3 / 5.4 — enforce sequence
    const existing = await this.milestoneRepo.find({
      where: { tradeDealId: dto.trade_deal_id },
      order: { recordedAt: 'ASC' },
    });

    const nextIndex = existing.length;
    const expected = MILESTONE_SEQUENCE[nextIndex];

    if (!expected) {
      throw new UnprocessableEntityException({
        code: 'ALL_MILESTONES_RECORDED',
        message: 'All milestones have already been recorded for this deal.',
      });
    }

    if (dto.milestone !== expected) {
      throw new UnprocessableEntityException({ expected });
    }

    // 5.2 — anchor on Stellar
    const dealIdShort = deal.id.replace(/-/g, '').slice(0, 8);
    const unixTs = Math.floor(Date.now() / 1000);
    const memoText = `AGRIC:MILESTONE:${dealIdShort}:${dto.milestone}:${unixTs}`;

    const signerSecret =
      deal.escrow_secret_key ||
      this.config.get<string>('STELLAR_PLATFORM_SECRET', '');

    const stellarTxId = await this.stellarService.recordMemo(memoText, signerSecret);

    const milestone = this.milestoneRepo.create({
      tradeDealId: dto.trade_deal_id,
      milestone: dto.milestone,
      recordedBy: userId,
      notes: dto.notes ?? null,
      stellarTxId,
    });

    return this.milestoneRepo.save(milestone);
  }
}
