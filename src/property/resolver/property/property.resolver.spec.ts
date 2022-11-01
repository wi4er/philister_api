import { Test, TestingModule } from '@nestjs/testing';
import { PropertyResolver } from './property.resolver';

describe('PropertyResolver', () => {
  let resolver: PropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyResolver],
    }).compile();

    resolver = module.get<PropertyResolver>(PropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
