import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WeightsService } from './weights.service';
import { CreateWeightDto, UpdateWeightDto } from './weight.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('weights')
@UseGuards(JwtAuthGuard)
export class WeightsController {
  constructor(private weightsService: WeightsService) {}

  // POST /api/weights - Create or update weight entry
  @Post()
  async upsertWeight(@Request() req, @Body() dto: CreateWeightDto) {
    return this.weightsService.upsertWeight(req.user.id, dto);
  }

  // GET /api/weights?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  @Get()
  async getWeights(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.weightsService.getWeightsByRange(
        req.user.id,
        startDate,
        endDate,
      );
    }

    return this.weightsService.getAllWeights(req.user.id);
  }

  // GET /api/weights/date/:date - Get weight for specific date
  @Get('date/:date')
  async getWeightByDate(@Request() req, @Param('date') date: string) {
    return this.weightsService.getWeightByDate(req.user.id, date);
  }

  // PUT /api/weights/:id - Update weight entry
  @Put(':id')
  async updateWeight(
    @Request() req,
    @Param('id') id: number,
    @Body() dto: UpdateWeightDto,
  ) {
    return this.weightsService.updateWeight(req.user.id, id, dto);
  }

  // DELETE /api/weights/:id - Delete weight entry
  @Delete(':id')
  async deleteWeight(@Request() req, @Param('id') id: number) {
    await this.weightsService.deleteWeight(req.user.id, id);
    return { message: 'Weight entry deleted successfully' };
  }

  // DELETE /api/weights/date/:date - Delete weight by date
  @Delete('date/:date')
  async deleteWeightByDate(@Request() req, @Param('date') date: string) {
    await this.weightsService.deleteWeightByDate(req.user.id, date);
    return { message: 'Weight entry deleted successfully' };
  }
}
