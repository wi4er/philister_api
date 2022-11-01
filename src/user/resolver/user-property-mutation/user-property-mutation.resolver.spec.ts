import { Test, TestingModule } from '@nestjs/testing';
import { UserPropertyMutationResolver } from './user-property-mutation.resolver';

describe('UserPropertyMutationResolver', () => {
  let resolver: UserPropertyMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPropertyMutationResolver],
    }).compile();

    resolver = module.get<UserPropertyMutationResolver>(UserPropertyMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
