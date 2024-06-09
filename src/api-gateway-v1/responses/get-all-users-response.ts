import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "./user-response";

export class GetAllUsersResponse {
    
    @ApiProperty({description: "Список всех пользователей"})
    users: UserResponse[];

    @ApiProperty({example: 3, description: "Кол-во страниц для отображение"})
    totalPages: number;

    @ApiProperty({example: 1, description: "Текущая страница"})
    currentPage: number;
}