import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ViewsService {
  constructor(
    private readonly dbService: DatabaseService
  ) { }

  async getTrainersPerformance() {
    return this.dbService.executeQuery(`
      SELECT * FROM vw_PerformanceEntrenadores;
    `)
  }
}
