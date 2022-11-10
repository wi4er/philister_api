import { Test, TestingModule } from '@nestjs/testing';
import { EncodeService } from './encode.service';

describe('EncodeService', () => {
  let service: EncodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ EncodeService ],
    }).compile();

    service = module.get<EncodeService>(EncodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    const hash = service.toSha256('qwerty');

    expect(hash).toBe('65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5');
  });
});
