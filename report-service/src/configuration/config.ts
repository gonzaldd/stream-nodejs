export default () => ({
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    db: process.env.DATABASE_DB,
  },
  S3_BUCKET: {
    endpoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT ? parseInt(process.env.S3_PORT, 10) : 9000,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
  },
});
