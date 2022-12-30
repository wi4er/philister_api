import { Test, TestingModule } from '@nestjs/testing';
import { ForgotController } from './forgot.controller';

describe('ForgotController', () => {
  let controller: ForgotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotController],
    }).compile();

    controller = module.get<ForgotController>(ForgotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
