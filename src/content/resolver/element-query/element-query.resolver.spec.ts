import { Test, TestingModule } from '@nestjs/testing';
import { ElementQueryResolver } from './element-query.resolver';

describe('ElementQueryResolver', () => {
  let resolver: ElementQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementQueryResolver],
    }).compile();

    resolver = module.get<ElementQueryResolver>(ElementQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
