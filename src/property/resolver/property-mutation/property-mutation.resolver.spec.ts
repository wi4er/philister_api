import { Test, TestingModule } from '@nestjs/testing';
import { PropertyMutationResolver } from './property-mutation.resolver';

describe('PropertyMutationResolver', () => {
  let resolver: PropertyMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyMutationResolver],
    }).compile();

    resolver = module.get<PropertyMutationResolver>(PropertyMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
