import { ValidationError } from 'joi';
import { createUserValidator } from '../../src/validators/createUserValidator';

test('validator throws when password is missing', async () => {
  const request = {
    name: 'some guy',
    email: 'some@email.com',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(`"password" is required`);
  }
});

test('validator throws when password is empty', async () => {
  const request = {
    name: 'some guy',
    email: 'some@email.com',
    password: '',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"password" is not allowed to be empty`
    );
  }
});

test('validator throws when password is smaller than 8 chars', async () => {
  const request = {
    name: 'some guy',
    email: 'some@email.com',
    password: '1234567',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"password" length must be at least 8 characters long`
    );
  }
});

test('validator throws when name is missing', async () => {
  const request = {
    email: 'some@email.com',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(`"name" is required`);
  }
});

test('validator throws when name is empty', async () => {
  const request = {
    name: '',
    email: 'some@email.com',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"name" is not allowed to be empty`
    );
  }
});

test('validator throws when name is larger than 50 chars', async () => {
  const request = {
    name: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy',
    email: 'some@email.com',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"name" length must be less than or equal to 50 characters long`
    );
  }
});

test('validator throws when email is missing', async () => {
  const request = {
    name: 'some guy',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(`"email" is required`);
  }
});

test('validator throws when email is empty', async () => {
  const request = {
    name: 'some buy',
    email: '',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"email" is not allowed to be empty`
    );
  }
});

test('validator throws when email is larger than 50 chars', async () => {
  const request = {
    name: 'some guy',
    email: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy@email.com',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"email" length must be less than or equal to 50 characters long`
    );
  }
});

test('validator throws when email does not have a domain', async () => {
  const request = {
    name: 'some guy',
    email: 'abcd',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"email" must be a valid email`
    );
  }
});

test('validator does not throw when all values are valid', async () => {
  const request = {
    name: 'some guy',
    email: 'abcd@gmail.com',
    password: '12345678',
  };

  try {
    await createUserValidator.validateAsync(request, { abortEarly: false });
  } catch (error) {
    fail();
  }
});
