import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupMutationResolver } from './user-group-mutation.resolver';

describe('UserGroupMutationResolver', () => {
  let resolver: UserGroupMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGroupMutationResolver],
    }).compile();

    resolver = module.get<UserGroupMutationResolver>(UserGroupMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
