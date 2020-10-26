import { ManagementClient } from 'auth0';
import { INewUser } from '../interfaces/iNewUser';
import { AUTH0 } from '../config';

// config to connect to auth0 management api
const auth0ManagementAPI = new ManagementClient({
  domain: AUTH0.DOMAIN,
  clientId: AUTH0.MANAGEMENT_API.CLIENT_ID,
  clientSecret: AUTH0.MANAGEMENT_API.CLIENT_SECRET,
});

// create a user in auth0
export async function createAuth0User(newUser: INewUser) {
  return await auth0ManagementAPI.createUser({
    connection: AUTH0.CONNECTION,
    verify_email: false,
    ...newUser,
  });
}

// get a user by email from auth0
export async function getAuth0User(email: string) {
  return await auth0ManagementAPI.getUsersByEmail(email);
}
