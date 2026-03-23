import { IsUUID, IsIn, IsOptional, IsString } from 'class-validator';
import { MilestoneType } from '../entities/shipment-milestone.entity';

export class CreateMilestoneDto {
  @IsUUID()
  trade_deal_id: string;

  @IsIn(['farm', 'warehouse', 'port', 'importer'])
  milestone: MilestoneType;

  @IsOptional()
  @IsString()
  notes?: string;
}
