import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'New quantity for the cart item (can be 0)' })
  @IsInt()
  @Min(0)
  quantity: number;
}
