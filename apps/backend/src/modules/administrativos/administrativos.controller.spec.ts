import { Test, TestingModule } from '@nestjs/testing';
import { AdministrativosController } from './administrativos.controller';
import { AdministrativosService } from './administrativos.service';

describe('AdministrativosController', () => {
  let controller: AdministrativosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministrativosController],
      providers: [AdministrativosService],
    }).compile();

    controller = module.get<AdministrativosController>(AdministrativosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
