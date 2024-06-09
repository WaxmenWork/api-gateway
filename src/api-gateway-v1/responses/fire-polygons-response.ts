import { ApiProperty } from '@nestjs/swagger';

export class FirePolygonsResponse {
  @ApiProperty({ example: {type: "Polygon", coordinates: [[108.54, 60.16], [108.21, 59.14]]}, description: 'Геометрия полигона' })
  geometry: {type: string, coordinates: any[]};

  @ApiProperty({ example: 120.0, description: 'Длина распространения' })
  length: number;

  @ApiProperty({ example: 900.0, description: 'Площадь распространения' })
  area: number;

  @ApiProperty({ description: 'Название региона', example: 'Республика Бурятия'})
  regionName: string;

  @ApiProperty({ description: 'Нахождение ТВВ в техногенной зоне', example: true })
  technogenicZone: boolean;

  @ApiProperty({ description: 'Название спутника', example: 'NOAA-20'})
  satelliteName: string;

  @ApiProperty({ description: 'Дата фиксации', example: Date.now().toString()})
  datetime: Date;
}
