import { Test, TestingModule } from '@nestjs/testing';
import { FlagPropertyResolver } from './flag-property.resolver';

describe('FlagPropertyResolver', () => {
  let resolver: FlagPropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagPropertyResolver],
    }).compile();

    resolver = module.get<FlagPropertyResolver>(FlagPropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
