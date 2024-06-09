import { ApiProperty } from "@nestjs/swagger";
import { RoleResponse } from "./role-response";

export class UserResponse {
    
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    id: number;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    name: string;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    surname: string;

    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    patronomic: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Электронная почта'})
    email: string;

    @ApiProperty({example: 'Yandex', description: 'Название организации'})
    organizationName: string;

    @ApiProperty({example: 'document.pdf', description: 'Путь к заявке на регистрацию'})
    filePath: string;

    @ApiProperty({
        example: [{id: 1, value: "USER", name: "Пользователь"}],
        description: 'Список ролей пользователя'})
    roles: RoleResponse[];
}