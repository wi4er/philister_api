import { Test, TestingModule } from '@nestjs/testing';
import { UserContactMutationResolver } from './user-contact-mutation.resolver';

describe('UserContactMutationResolver', () => {
  let resolver: UserContactMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserContactMutationResolver],
    }).compile();

    resolver = module.get<UserContactMutationResolver>(UserContactMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
