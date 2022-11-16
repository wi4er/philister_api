import { Test, TestingModule } from '@nestjs/testing';
import { FlagRootResolver } from './flag-root.resolver';

describe('FlagRootResolver', () => {
  let resolver: FlagRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagRootResolver],
    }).compile();

    resolver = module.get<FlagRootResolver>(FlagRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
