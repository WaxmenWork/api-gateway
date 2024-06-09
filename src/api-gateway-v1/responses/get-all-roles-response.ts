import { ApiProperty } from "@nestjs/swagger";
import { RoleResponse } from "./role-response";

export class GetAllRolesResponse {
    
    @ApiProperty({description: "Список всех ролей"})
    roles: RoleResponse[];

    @ApiProperty({example: 3, description: "Кол-во страниц для отображение"})
    totalPages: number;

    @ApiProperty({example: 1, description: "Текущая страница"})
    currentPage: number;
}