import { pool } from '../dbqurries/pool';

// read users from the table
export async function readUsers(ctx: Body) {
  const results = await pool.query('select * from user');
  console.table(results.rows);
  return results;
}
