import { ApiProperty } from "@nestjs/swagger";

export class RoleResponse {

    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    id: number;
  
    @ApiProperty({example: 'ADMIN', description: 'Уникальное значение роли'})
    value: string;
  
    @ApiProperty({example: 'Администратор', description: 'Название роли'})
    name: string;
  
    @ApiProperty({example: true, description: 'Ограничение возможности удаления роли'})
    isNessessory: boolean;

    @ApiProperty({example: true, description: 'Роль с правами суперпользователя'})
    isSuperuser: boolean;

    @ApiProperty({example: true, description: 'Роль для получения электронных писем с подтверждением аккаунтов'})
    isMailReceiver: boolean;

    @ApiProperty({example: false, description: 'Роль без права доступа к ресурсам'})
    isBlocked: boolean;

  }