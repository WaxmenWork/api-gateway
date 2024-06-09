import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

  @ApiProperty({example: 'user@mail.ru', description: 'Электронная почта'})
  @IsEmail({}, {message: "Некорректный Email"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly email: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'qwerty123', description: 'Пароль'})
  readonly password: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'Иван', description: 'Имя'})
  readonly name: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'Иванов', description: 'Фамилия'})
  readonly surname: string;

  @IsString({message: "Поле должно быть строковым"})
  @ApiProperty({example: 'Иванович', description: 'Отчество'})
  readonly patronomic: string;

  @IsString({message: "Поле должно быть строковым"})
  @ApiProperty({example: 'Yandex', description: 'Название организации'})
  readonly organizationName: string;

  @ApiProperty({example: 'document.pdf', description: 'Документ с заявкой на регистрацию'})
  readonly file: Express.Multer.File;
}
