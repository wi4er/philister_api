import { Test, TestingModule } from '@nestjs/testing';
import { ElementResolver } from './element.resolver';

describe('ElementResolver', () => {
  let resolver: ElementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElementResolver],
    }).compile();

    resolver = module.get<ElementResolver>(ElementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
