import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryResolver } from './directory.resolver';
import { AppModule } from "../../../app.module";

describe('DirectoryResolver', () => {
  let resolver: DirectoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({imports: [AppModule]}).compile();

    resolver = module.get<DirectoryResolver>(DirectoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
