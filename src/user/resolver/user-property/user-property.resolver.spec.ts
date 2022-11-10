import { Test, TestingModule } from '@nestjs/testing';
import { UserPropertyResolver } from './user-property.resolver';
import { AppModule } from "../../../app.module";

describe('UserPropertyResolver', () => {
  let resolver: UserPropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({imports: [AppModule]}).compile();
    resolver = module.get<UserPropertyResolver>(UserPropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
