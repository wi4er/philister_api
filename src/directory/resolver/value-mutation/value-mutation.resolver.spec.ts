import { Test, TestingModule } from '@nestjs/testing';
import { ValueMutationResolver } from './value-mutation.resolver';

describe('ValueMutationResolver', () => {
  let resolver: ValueMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValueMutationResolver],
    }).compile();

    resolver = module.get<ValueMutationResolver>(ValueMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
