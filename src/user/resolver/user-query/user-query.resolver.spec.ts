import { Test, TestingModule } from '@nestjs/testing';
import { UserQueryResolver } from './user-query.resolver';

describe('UserRootQueryResolver', () => {
  let resolver: UserQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQueryResolver],
    }).compile();

    resolver = module.get<UserQueryResolver>(UserQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
