import { Test, TestingModule } from '@nestjs/testing';
import { UserContactStringResolver } from './user-contact-string.resolver';

describe('UserContactStringResolver', () => {
  let resolver: UserContactStringResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserContactStringResolver],
    }).compile();

    resolver = module.get<UserContactStringResolver>(UserContactStringResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
