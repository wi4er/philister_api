import { Test, TestingModule } from '@nestjs/testing';
import { UserRootResolver } from './user-root.resolver';

describe('UserRootResolver', () => {
  let resolver: UserRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRootResolver],
    }).compile();

    resolver = module.get<UserRootResolver>(UserRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
