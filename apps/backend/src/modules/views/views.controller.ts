import { Controller, Get } from '@nestjs/common';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) { }

  @Get('trainers-performance')
  async getTrainersPerformance() {
    const performance = await this.viewsService.getTrainersPerformance();
    return performance.recordset;
  }
}
