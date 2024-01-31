import { PartialType } from '@nestjs/mapped-types';
import { CreateSabbathschoolDto } from './create-sabbathschool.dto';

export class UpdateSabbathschoolDto extends PartialType(CreateSabbathschoolDto) {}
