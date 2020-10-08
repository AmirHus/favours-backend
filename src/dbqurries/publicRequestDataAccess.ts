import { INewPublicRequest } from '../interfaces/iNewPublicRequest';
import { pool } from './pool';

export async function createPublicRequest(publicRequest: INewPublicRequest) {
  const newPublicRequest = await pool.query(
    `
    INSERT into public.public_request (created_by, title, description, completed)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [
      publicRequest.createdBy,
      publicRequest.title,
      publicRequest.description,
      publicRequest.completed,
    ]
  );

  return newPublicRequest.rows[0];
}
