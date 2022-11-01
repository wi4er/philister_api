import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRootResolver } from './property-root.resolver';

describe('PropertyRootResolver', () => {
  let resolver: PropertyRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyRootResolver],
    }).compile();

    resolver = module.get<PropertyRootResolver>(PropertyRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
