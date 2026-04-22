import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTradeDeals1699900000002 implements MigrationInterface {
  name = 'CreateTradeDeals1699900000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "trade_deals" (
        "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "commodity"           TEXT NOT NULL,
        "quantity"            NUMERIC NOT NULL,
        "quantity_unit"       TEXT NOT NULL DEFAULT 'kg',
        "total_value"         NUMERIC NOT NULL,
        "token_count"         INTEGER NOT NULL,
        "token_symbol"        TEXT NOT NULL UNIQUE,
        "status"              TEXT NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft', 'open', 'funded', 'delivered', 'completed', 'failed')),
        "farmer_id"           UUID NOT NULL REFERENCES users(id),
        "trader_id"           UUID NOT NULL REFERENCES users(id),
        "escrow_public_key"   TEXT,
        "escrow_secret_key"   TEXT,
        "issuer_public_key"   TEXT,
        "total_invested"      NUMERIC NOT NULL DEFAULT 0,
        "delivery_date"       DATE NOT NULL,
        "stellar_asset_tx_id" TEXT,
        "created_at"          TIMESTAMPTZ DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "trade_deals"`);
  }
}
