import { Test, TestingModule } from '@nestjs/testing';
import { SectionQueryResolver } from './section-query.resolver';

describe('SectionQueryResolver', () => {
  let resolver: SectionQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionQueryResolver],
    }).compile();

    resolver = module.get<SectionQueryResolver>(SectionQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
