import { Test, TestingModule } from '@nestjs/testing';
import { BlockMutationResolver } from './block-mutation.resolver';

describe('BlockMutationResolver', () => {
  let resolver: BlockMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockMutationResolver],
    }).compile();

    resolver = module.get<BlockMutationResolver>(BlockMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
