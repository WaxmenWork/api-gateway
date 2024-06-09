import { ApiProperty } from '@nestjs/swagger';

export class FirePointDatetimesResponse {
    
    @ApiProperty({ description: 'Дата фиксации', example: Date.now().toString()})
    datetime: Date;
}
