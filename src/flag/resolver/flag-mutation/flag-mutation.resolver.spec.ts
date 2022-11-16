import { Test, TestingModule } from '@nestjs/testing';
import { FlagMutationResolver } from './flag-mutation.resolver';

describe('FlagMutationResolver', () => {
  let resolver: FlagMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagMutationResolver],
    }).compile();

    resolver = module.get<FlagMutationResolver>(FlagMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
