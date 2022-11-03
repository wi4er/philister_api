import { Test, TestingModule } from '@nestjs/testing';
import { UserPropertyResolver } from './user-property.resolver';

describe('UserPropertyResolver', () => {
  let resolver: UserPropertyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPropertyResolver],
    }).compile();

    resolver = module.get<UserPropertyResolver>(UserPropertyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
