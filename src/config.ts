export const DB_CONFIG = {
  PASSWORD: process.env.DB_PASSWORD as string,
  USERNAME: process.env.DB_USERNAME as string,
  NAME: process.env.DB_NAME as string,
  PORT: Number.parseInt(process.env.DB_PORT, 10),
  HOST: process.env.DB_HOST as string,
};

export const AUTH0 = {
  BASE_ENDPOINT_URL: `https://${process.env.AUTH0_DOMAIN}`,
  DOMAIN: process.env.AUTH0_DOMAIN as string,
  JWKS_URI: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  CLIENT_ID: process.env.AUTH0_CLIENT_ID as string,
  CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET as string,
  HOST: process.env.DB_HOST as string,
  CONNECTION: 'Username-Password-Authentication',
  MANAGEMENT_API: {
    CLIENT_ID: process.env.AUTH0_MANAGEMENT_API_CLIENT_ID as string,
    CLIENT_SECRET: process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET as string,
  },
};

export const AWS_CONFIG = {
  BUCKET_ID: process.env.BUCKET_ID as string,
  ACCESS_KEY_ID: process.env.ACCESS_KEY as string,
  SECRET_KEY: process.env.SECRET_KEY as string,
};
