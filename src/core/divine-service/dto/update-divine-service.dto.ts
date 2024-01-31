import { PartialType } from '@nestjs/mapped-types';
import { CreateDivineServiceDto } from './create-divine-service.dto';

export class UpdateDivineServiceDto extends PartialType(CreateDivineServiceDto) {}
