import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentDistributions1700000006 implements MigrationInterface {
  name = 'CreatePaymentDistributions1700000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "payment_distributions" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "trade_deal_id"  UUID NOT NULL REFERENCES trade_deals(id),
        "recipient_id"   UUID NOT NULL REFERENCES users(id),
        "recipient_type" TEXT NOT NULL CHECK (recipient_type IN ('farmer', 'investor', 'platform')),
        "amount_usd"     NUMERIC NOT NULL,
        "stellar_tx_id"  TEXT,
        "status"         TEXT NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'confirmed', 'failed')),
        "created_at"     TIMESTAMPTZ DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_distributions"`);
  }
}
