import { Test, TestingModule } from '@nestjs/testing';
import { FlagFlagResolver } from './flag-flag.resolver';

describe('FlagFlagResolver', () => {
  let resolver: FlagFlagResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagFlagResolver],
    }).compile();

    resolver = module.get<FlagFlagResolver>(FlagFlagResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
