import { IUser } from '../interfaces/iUser';
import { pool } from './pool';

export async function createUser(newUser: IUser) {
  const user = await pool.query(
    `
    INSERT into public.user (id, email, name)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [newUser.id, newUser.email, newUser.name]
  );
  return user.rows[0];
}

export async function getUserById(id: string) {
  const user = await pool.query(
    `
    SELECT * FROM public.user
    WHERE id = $1
    `,
    [id]
  );

  return user.rows[0];
}
