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

export async function getAvailablePublicRequests() {
  const availalbePublicRequest = await pool.query(
    `
    SELECT P.id, U.name as created_by_name, u.email as created_by_email, description, title
    FROM public.public_request P INNER JOIN public.user U
    ON P.created_by = U.id
    WHERE P.accepted_by IS NULL
    ORDER BY P.id DESC
    `
  );

  return availalbePublicRequest.rows;
}

export async function getPublicRequestById(id: number) {
  const request = await pool.query(
    `
    SELECT * FROM public.public_request WHERE id = $1
    `,
    [id]
  );

  return request.rows;
}

export async function acceptPublicRequest(id: number, userId: string) {
  await pool.query(
    `
    UPDATE public.public_request SET accepted_by = $1 WHERE id = $2    
    `,
    [userId, id]
  );
  return;
}
