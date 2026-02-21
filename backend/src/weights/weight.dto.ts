import { IsNumber, IsString, Matches, Min, Max } from 'class-validator';

export class CreateWeightDto {
  @IsNumber()
  @Min(1)
  @Max(500)
  weight: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;
}

export class UpdateWeightDto {
  @IsNumber()
  @Min(1)
  @Max(500)
  weight: number;
}
