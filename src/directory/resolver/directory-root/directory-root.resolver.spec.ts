import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryRootResolver } from './directory-root.resolver';
import { AppModule } from "../../../app.module";

describe('DirectoryRootResolver', () => {
  let resolver: DirectoryRootResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({imports: [AppModule]}).compile();

    resolver = module.get<DirectoryRootResolver>(DirectoryRootResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
