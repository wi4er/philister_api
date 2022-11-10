import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRootResolver } from './property-root.resolver';
import { AppModule } from '../../../app.module';

describe('PropertyRootResolver', () => {
  let resolver: PropertyRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    resolver = module.get<PropertyRootResolver>(PropertyRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
