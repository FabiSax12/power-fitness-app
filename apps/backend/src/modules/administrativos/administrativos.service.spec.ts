import { Test, TestingModule } from '@nestjs/testing';
import { AdministrativosService } from './administrativos.service';

describe('AdministrativosService', () => {
  let service: AdministrativosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministrativosService],
    }).compile();

    service = module.get<AdministrativosService>(AdministrativosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
