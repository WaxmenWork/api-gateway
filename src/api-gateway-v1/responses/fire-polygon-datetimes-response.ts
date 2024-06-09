import { ApiProperty } from '@nestjs/swagger';

export class FirePolygonDatetimesResponse {
    
    @ApiProperty({ description: 'Дата фиксации', example: Date.now().toString()})
    datetime: Date;
}
