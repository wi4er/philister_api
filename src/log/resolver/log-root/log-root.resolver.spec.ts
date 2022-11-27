import { Test, TestingModule } from '@nestjs/testing';
import { LogRootResolver } from './log-root.resolver';

describe('LogRootResolver', () => {
  let resolver: LogRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogRootResolver],
    }).compile();

    resolver = module.get<LogRootResolver>(LogRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
