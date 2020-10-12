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

export async function completeFavour(favourId: number) {
  const query = {
    text: 'UPDATE favour SET owing = false, repaid = true WHERE id = $1',
    values: [favourId],
  };
  // callback
  await pool.query(query);
}

// read favours from the table
export async function getOwedFavours(user: string) {
  const query = {
    text: 'SELECT * FROM favour where created_by = $1 and repaid = false',
    values: [user],
  };
  // callback
  return (await pool.query(query)).rows;
}

// read favours from the table
export async function getOwingFavours(user: string) {
  const query = {
    text: 'SELECT * FROM favour where other_party = $1 and repaid = false',
    values: [user],
  };
  // callback
  return (await pool.query(query)).rows;
}
