import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1699900000001 implements MigrationInterface {
  name = 'CreateUsers1699900000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"          TEXT UNIQUE NOT NULL,
        "password_hash"  TEXT NOT NULL,
        "role"           TEXT NOT NULL CHECK (role IN ('farmer', 'trader', 'investor')),
        "country"        TEXT NOT NULL,
        "kyc_status"     TEXT NOT NULL DEFAULT 'pending'
                           CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
        "wallet_address" TEXT UNIQUE,
        "created_at"     TIMESTAMPTZ DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
