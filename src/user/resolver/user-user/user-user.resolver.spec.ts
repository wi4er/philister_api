import { Test, TestingModule } from '@nestjs/testing';
import { UserUserResolver } from './user-user.resolver';

describe('UserUserResolver', () => {
  let resolver: UserUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUserResolver],
    }).compile();

    resolver = module.get<UserUserResolver>(UserUserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
