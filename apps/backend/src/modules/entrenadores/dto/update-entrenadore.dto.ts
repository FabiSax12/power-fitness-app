import { PartialType } from '@nestjs/mapped-types';
import { CreateEntrenadoreDto } from './create-entrenadore.dto';

export class UpdateEntrenadoreDto extends PartialType(CreateEntrenadoreDto) {}
