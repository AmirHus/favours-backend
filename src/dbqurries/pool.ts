import { Pool } from 'pg';
import { DB_CONFIG } from '../config';

// setting up the connection to the database for other functions to use
export const pool = new Pool({
  user: DB_CONFIG.USERNAME,
  host: DB_CONFIG.HOST,
  database: DB_CONFIG.NAME,
  password: DB_CONFIG.PASSWORD,
  port: DB_CONFIG.PORT,
});
