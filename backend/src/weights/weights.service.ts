import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Weight } from './weight.entity';
import { CreateWeightDto, UpdateWeightDto } from './weight.dto';

@Injectable()
export class WeightsService {
  constructor(
    @InjectRepository(Weight)
    private weightsRepository: Repository<Weight>,
  ) {}

  async upsertWeight(userId: number, dto: CreateWeightDto): Promise<Weight> {
    const existing = await this.weightsRepository.findOne({
      where: { userId, date: dto.date },
    });

    if (existing) {
      existing.weight = dto.weight;
      return this.weightsRepository.save(existing);
    }

    const weight = this.weightsRepository.create({
      ...dto,
      userId,
    });

    return this.weightsRepository.save(weight);
  }

  async getWeightByDate(userId: number, date: string): Promise<Weight | null> {
    return this.weightsRepository.findOne({
      where: { userId, date },
    });
  }

  async getWeightsByRange(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<Weight[]> {
    return this.weightsRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async getAllWeights(userId: number): Promise<Weight[]> {
    return this.weightsRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async updateWeight(
    userId: number,
    id: number,
    dto: UpdateWeightDto,
  ): Promise<Weight> {
    const weight = await this.weightsRepository.findOne({
      where: { id, userId },
    });

    if (!weight) {
      throw new NotFoundException('Weight entry not found');
    }

    weight.weight = dto.weight;
    return this.weightsRepository.save(weight);
  }

  async deleteWeight(userId: number, id: number): Promise<void> {
    const result = await this.weightsRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Weight entry not found');
    }
  }

  async deleteWeightByDate(userId: number, date: string): Promise<void> {
    const result = await this.weightsRepository.delete({ userId, date });

    if (result.affected === 0) {
      throw new NotFoundException('Weight entry not found');
    }
  }
}
