import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvestments1700000004 implements MigrationInterface {
  name = 'CreateInvestments1700000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "investments" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "trade_deal_id" UUID NOT NULL REFERENCES trade_deals(id),
        "investor_id"   UUID NOT NULL REFERENCES users(id),
        "token_amount"  INTEGER NOT NULL,
        "amount_usd"    NUMERIC NOT NULL,
        "stellar_tx_id" TEXT,
        "status"        TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'confirmed', 'failed')),
        "created_at"    TIMESTAMPTZ DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "investments"`);
  }
}
