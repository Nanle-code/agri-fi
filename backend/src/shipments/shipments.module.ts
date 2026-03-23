import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentMilestone } from './entities/shipment-milestone.entity';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentMilestone])],
  providers: [ShipmentsService],
  controllers: [ShipmentsController],
})
export class ShipmentsModule {}
