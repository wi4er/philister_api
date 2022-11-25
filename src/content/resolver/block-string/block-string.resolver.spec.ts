import { Test, TestingModule } from '@nestjs/testing';
import { BlockStringResolver } from './block-string.resolver';

describe('BlockStringResolver', () => {
  let resolver: BlockStringResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockStringResolver],
    }).compile();

    resolver = module.get<BlockStringResolver>(BlockStringResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
