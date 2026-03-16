import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocuments1700000003 implements MigrationInterface {
  name = 'CreateDocuments1700000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "documents" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "trade_deal_id" UUID NOT NULL REFERENCES trade_deals(id),
        "uploader_id"   UUID NOT NULL REFERENCES users(id),
        "doc_type"      TEXT NOT NULL CHECK (doc_type IN (
                          'purchase_agreement',
                          'bill_of_lading',
                          'export_certificate',
                          'warehouse_receipt'
                        )),
        "ipfs_hash"     TEXT NOT NULL,
        "storage_url"   TEXT NOT NULL,
        "stellar_tx_id" TEXT,
        "created_at"    TIMESTAMPTZ DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "documents"`);
  }
}
