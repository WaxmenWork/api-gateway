import { ApiProperty } from "@nestjs/swagger";

export class AboutResponse {

    @ApiProperty({example: 'Геопортал посвящен...', description: 'Контентное наполнение'})
    content: string;
}