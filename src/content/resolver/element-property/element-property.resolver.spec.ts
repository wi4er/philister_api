import { Test, TestingModule } from '@nestjs/testing';
import { ElementPropertyResolver } from './element-property.resolver';

describe('ElementPropertyResolver', () => {
  let resolver: ElementPropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementPropertyResolver],
    }).compile();

    resolver = module.get<ElementPropertyResolver>(ElementPropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
