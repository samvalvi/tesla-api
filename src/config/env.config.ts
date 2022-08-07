export const GetEnv = () => ({
  port: process.env.PORT || 3000,
  postgres_host: process.env.POSTGRES_HOST,
  postgres_port: process.env.POSTGRES_PORT,
  postgres_user: process.env.POSTGRES_USER,
  postgres_password: process.env.POSTGRES_PASSWORD,
  postgres_database: process.env.POSTGRES_DB,
});
