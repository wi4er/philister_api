import { Test, TestingModule } from '@nestjs/testing';
import { UserMutationResolver } from './user-mutation.resolver';

describe('UserRootMutationResolver', () => {
  let resolver: UserMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMutationResolver],
    }).compile();

    resolver = module.get<UserMutationResolver>(UserMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
