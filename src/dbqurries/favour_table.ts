import { BaseContext } from 'koa';
import { pool } from '../dbqurries/pool';

// insert new favour into the table
async function createUser(ctx: Body) {
  const results = await pool.query('select * from favour');
}
