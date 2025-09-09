import typeorm from 'typeorm';
const { MigrationInterface, QueryRunner } = typeorm;

export class BaseData1757383982597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const batchSize = 10000;
    const totalRows = 10_000_000;

    // Disable logging
    const originalLogging = queryRunner.connection.options.logging;
    queryRunner.connection.options.logging = false;

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

    // Restore original logging settings
    queryRunner.connection.options.logging = originalLogging;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM bill');
  }
}
