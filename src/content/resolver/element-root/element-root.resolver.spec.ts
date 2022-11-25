import { Test, TestingModule } from '@nestjs/testing';
import { ElementRootResolver } from './element-root.resolver';

describe('ElementRootResolver', () => {
  let resolver: ElementRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementRootResolver],
    }).compile();

    resolver = module.get<ElementRootResolver>(ElementRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
