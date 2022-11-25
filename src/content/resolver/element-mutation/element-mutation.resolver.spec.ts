import { Test, TestingModule } from '@nestjs/testing';
import { ElementMutationResolver } from './element-mutation.resolver';

describe('ElementMutationResolver', () => {
  let resolver: ElementMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementMutationResolver],
    }).compile();

    resolver = module.get<ElementMutationResolver>(ElementMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
