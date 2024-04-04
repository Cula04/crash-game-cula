import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorDto } from './error.dto';

export class OutputDto<T> {
  @ApiPropertyOptional({ type: 'object' })
  data?: T;

  @ApiProperty({
    anyOf: [
      { $ref: getSchemaPath(ErrorDto) },
      { type: 'array', items: { $ref: getSchemaPath(ErrorDto) } },
    ],
    required: false,
  })
  error?: ErrorDto | ErrorDto[];
}
