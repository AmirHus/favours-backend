export const DB_CONFIG = {
  PASSWORD: process.env.DB_PASSWORD as string,
  USERNAME: process.env.DB_USERNAME as string,
  NAME: process.env.DB_NAME as string,
  PORT: Number.parseInt(process.env.DB_PORT, 10),
  HOST: process.env.DB_HOST as string,
};
