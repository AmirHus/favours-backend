import { pool } from '../dbqurries/pool';

// read favours from the table
export async function createFavour(
  createdBy: string,
  otherParty: string,
  favorItem: string,
  noOfItems: number
) {
  const query = {
    text:
      'INSERT INTO favour(owing, created_by, other_party, favour_item, repaid, no_of_items) VALUES($1, $2, $3, $4, $5, $6)',
    values: [true, createdBy, otherParty, favorItem, false, noOfItems],
  };
  // callback
  await pool.query(query);
}
