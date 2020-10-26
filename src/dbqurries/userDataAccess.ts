import { IUser } from '../interfaces/iUser';
import { pool } from './pool';

// creates a user entity
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

// returns a specific user by id
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

// returns all the users in the database
// excpet for a specefic user
export async function getAllUsersExceptCaller(id: string) {
  const users = await pool.query(
    `
    SELECT * FROM public.user
    WHERE id != $1
    `,
    [id]
  );

  return users.rows;
}
