import { ApiProperty } from '@nestjs/swagger';

export class ApiStatus {
  @ApiProperty()
  status: 'ok';
}
