import { ValidationError } from 'joi';
import { addRewardsValidator } from '../../src/validators/addRewardsValidator';
import { INewPublicRequestReward } from '../../src/interfaces/iNewPublicRequestReward';

test('validator throws when array is empty', async () => {
  const request = { rewards: [] } as { rewards: INewPublicRequestReward[] };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards" must contain at least 1 items`
    );
  }
});

test('validator throws when object is empty', async () => {
  const request = {};

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(`"rewards" is required`);
  }
});

test('validator throws when INewPublicRequestReward object is empty', async () => {
  const request = { rewards: [{}] } as { rewards: unknown };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards[0].rewardItem" is required. "rewards[0].noOfRewards" is required`
    );
  }
});

test('validator throws when rewardItem is empty', async () => {
  const request = { rewards: [{ rewardItem: '', noOfRewards: 2 }] } as {
    rewards: INewPublicRequestReward[];
  };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards[0].rewardItem" must be one of [coffee, chips, chocolate, tea, cupcake]. "rewards[0].rewardItem" is not allowed to be empty`
    );
  }
});

test('validator throws when rewardItem is non string', async () => {
  const request = { rewards: [{ rewardItem: 2, noOfRewards: 2 }] } as {
    rewards: unknown[];
  };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards[0].rewardItem" must be one of [coffee, chips, chocolate, tea, cupcake]. "rewards[0].rewardItem" must be a string`
    );
  }
});

test('validator throws when rewardItem is not valid reward type', async () => {
  const request = { rewards: [{ rewardItem: 'cheese', noOfRewards: 2 }] } as {
    rewards: unknown[];
  };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards[0].rewardItem" must be one of [coffee, chips, chocolate, tea, cupcake]`
    );
  }
});

test('validator throws when noOfRewards is non number', async () => {
  const request = { rewards: [{ rewardItem: 'tea', noOfRewards: '' }] } as {
    rewards: unknown[];
  };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards[0].noOfRewards" must be a number`
    );
  }
});

test('validator throws when noOfRewards is <1', async () => {
  const request = { rewards: [{ rewardItem: 'tea', noOfRewards: 0 }] } as {
    rewards: unknown[];
  };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
    fail();
  } catch (error) {
    expect((error as ValidationError).message).toBe(
      `"rewards[0].noOfRewards" must be greater than or equal to 1`
    );
  }
});

test('validator does not throw when all values are valid', async () => {
  const request = { rewards: [{ rewardItem: 'tea', noOfRewards: 2 }] } as {
    rewards: INewPublicRequestReward[];
  };

  try {
    await addRewardsValidator.validateAsync(request, { abortEarly: false });
  } catch (error) {
    fail();
  }
});
