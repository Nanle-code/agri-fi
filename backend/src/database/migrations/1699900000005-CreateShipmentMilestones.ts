import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShipmentMilestones1699900000005 implements MigrationInterface {
  name = 'CreateShipmentMilestones1699900000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "shipment_milestones" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "trade_deal_id" UUID NOT NULL REFERENCES trade_deals(id),
        "milestone"     TEXT NOT NULL CHECK (milestone IN ('farm', 'warehouse', 'port', 'importer')),
        "recorded_by"   UUID NOT NULL REFERENCES users(id),
        "notes"         TEXT,
        "stellar_tx_id" TEXT,
        "recorded_at"   TIMESTAMPTZ DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shipment_milestones"`);
  }
}
