import { Test, TestingModule } from '@nestjs/testing';
import { UserUserContactResolver } from './user-user-contact.resolver';

describe('UserUserContactResolver', () => {
  let resolver: UserUserContactResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUserContactResolver],
    }).compile();

    resolver = module.get<UserUserContactResolver>(UserUserContactResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
