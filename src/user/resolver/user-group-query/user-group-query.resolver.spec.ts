import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupQueryResolver } from './user-group-query.resolver';

describe('UserGroupQueryResolver', () => {
  let resolver: UserGroupQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGroupQueryResolver],
    }).compile();

    resolver = module.get<UserGroupQueryResolver>(UserGroupQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
