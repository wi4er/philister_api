import { Test, TestingModule } from '@nestjs/testing';
import { EncodeService } from './encode.service';

describe('EncodeService', () => {
  let service: EncodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncodeService],
    }).compile();

    service = module.get<EncodeService>(EncodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
