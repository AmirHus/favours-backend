export const DB_CONFIG = {
  PASSWORD: process.env.DB_PASSWORD as string,
  USERNAME: process.env.DB_USERNAME as string,
  NAME: process.env.DB_NAME as string,
  PORT: Number.parseInt(process.env.DB_PORT, 10),
  HOST: process.env.DB_HOST as string,
};

export const AUTH0 = {
  BASE_ENDPOINT_URL: `https://${process.env.AUTH0_BASE_URL}`,
  CLIENT_ID: process.env.AUTH0_CLIENT_ID as string,
  CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET as string,
};
