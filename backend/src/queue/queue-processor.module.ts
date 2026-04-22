import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueProcessor } from './queue.processor';
import { TradeDealsModule } from '../trade-deals/trade-deals.module';
import { StellarModule } from '../stellar/stellar.module';
import { Investment } from '../investments/entities/investment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment]),
    TradeDealsModule,
    StellarModule,
  ],
  providers: [QueueProcessor],
})
export class QueueProcessorModule {}
