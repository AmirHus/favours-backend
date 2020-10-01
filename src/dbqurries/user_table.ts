import { pool } from '../dbqurries/pool';

// read all users from the table
export async function readUsers() {
  const query = {
    text: 'SELECT * FROM user',
  };
  // callback
  await pool.query(query);
}

// Create a new user
export async function createUser(email: string, name: string) {
  const query = {
    text: 'INSERT INTO user(email, name) VALUES($1, $2)',
    values: [email, name],
  };
  // callback
  await pool.query(query);
}
