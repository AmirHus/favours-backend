import { pool } from './pool';

// read favours from the table
export async function createFavour(
  createdBy: string,
  otherParty: string,
  favorItem: string,
  noOfItems: number,
  owing: boolean,
  proof: string | null
) {
  await pool.query(
    `
    INSERT INTO favour(owing, created_by, other_party, favour_item, repaid, no_of_items, proof) VALUES($1, $2, $3, $4, $5, $6, $7)
    `,
    [owing, createdBy, otherParty, favorItem, false, noOfItems, proof]
  );
}

// complete favour with proof
export async function completeFavourWithProof(id: number, proof: string) {
  await pool.query(
    `
    UPDATE public.favour SET repaid = true, proof_of_completion = $1 WHERE id = $2
    `,
    [proof, id]
  );
}

// complete favour without proof
export async function completeFavourWithoutProof(id: number) {
  await pool.query(
    `
    UPDATE public.favour SET repaid = true WHERE id = $1
    `,
    [id]
  );
}

// read favours from the table
export async function getOwedFavours(user: string) {
  const favours = await pool.query(
    `
    SELECT * FROM favour WHERE ((created_by = $1 AND owing = false) OR (other_party = $1 and owing = true)) AND repaid = false
    `,
    [user]
  );

  return favours.rows;
}

// read favours from the table
export async function getOwingFavours(user: string) {
  const favours = await pool.query(
    `
    SELECT * FROM favour WHERE ((created_by = $1 AND owing = true) OR (other_party = $1 and owing = false)) AND repaid = false
    `,
    [user]
  );

  return favours.rows;
}

export async function getFavourProof(id: number) {
  const favour = await pool.query(
    `
    SELECT proof, created_by, other_party FROM public.favour WHERE id = $1
    `,
    [id]
  );

  return favour.rows;
}

export async function getFavourById(id: number) {
  const favour = await pool.query(
    `
    SELECT * FROM public.favour WHERE id = $1
    `,
    [id]
  );

  return favour.rows;
}
