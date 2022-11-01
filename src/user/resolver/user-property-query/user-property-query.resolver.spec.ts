import { Test, TestingModule } from '@nestjs/testing';
import { UserPropertyQueryResolver } from './user-property-query.resolver';

describe('UserPropertyQueryResolver', () => {
  let resolver: UserPropertyQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPropertyQueryResolver],
    }).compile();

    resolver = module.get<UserPropertyQueryResolver>(UserPropertyQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
