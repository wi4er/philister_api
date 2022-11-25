import { Test, TestingModule } from '@nestjs/testing';
import { SectionMutationResolver } from './section-mutation.resolver';

describe('SectionMutationResolver', () => {
  let resolver: SectionMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionMutationResolver],
    }).compile();

    resolver = module.get<SectionMutationResolver>(SectionMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
