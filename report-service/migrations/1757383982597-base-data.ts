import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class BaseData1757383982597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const batchSize = 10000;
    const totalRows = 10_000_000;

    for (let i = 0; i < totalRows / batchSize; i++) {
      const rows: string[] = [];
      for (let j = 0; j < batchSize; j++) {
        const userId = Math.floor(Math.random() * 30) + 1;
        const amount = (Math.random() * 10000).toFixed(2); // Random amount up to 10,000

        rows.push(`(${userId}, ${amount})`);
      }

      const query = `INSERT INTO bill ("userId", amount) VALUES ${rows.join(',')}`;
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM bill');
  }
}
