import { pool } from '../dbqurries/pool';

// read favours from the table
export async function createFavour(ctx: Body) {
  const results = await pool.query('select * from favour');
  console.table(results.rows);
  return results;
}
