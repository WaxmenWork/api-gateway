import { Controller, Get, Post, Body, Param, Query, Delete, Inject, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UseGuards, Put } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCurrentUser, GetCurrentUserId, Public, RoleFalseFlags, RoleFlags } from 'src/common/decorators';
import { AddRoleDto, ChangePasswordDto, ConfirmUserDto, CreateRoleDto, CreateUserDto, DeleteRoleDto, LoginUserDto, RecoverPasswordDto, RegistrationUserDto, UpdateAboutDto, UpdateRoleDto, UpdateUserAdminDto, UpdateUserDto } from './dto';
import { FirePointDatetimesResponse, FirePointsResponse, FirePolygonDatetimesResponse, FirePolygonsResponse, GetAllRolesResponse, GetAllUsersResponse, RoleResponse, TokensResponse, UserResponse } from './responses';
import { FileInterceptor } from '@nestjs/platform-express';
import { RefreshTokenGuard, RolesAccessGuard } from 'src/common/guards';
import { catchError, throwError } from 'rxjs';
import { AboutResponse } from './responses/about-response';

@Controller('/v1')
export class ApiGatewayV1Controller {

  constructor(
    @Inject("USERS_MS") private readonly usersMService: ClientProxy,
    @Inject("PORTAL_MS") private readonly portalMService: ClientProxy,
    ) {}

  /* МАРШРУТЫ АВТОРИЗАЦИИ */

  @ApiOperation({summary: "Авторизация", tags: ["Авторизация"]})
  @ApiResponse({status:200, type: TokensResponse})
  @Public()
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: LoginUserDto) {
      return this.usersMService
              .send({ cmd: "login" }, {body: userDto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Регистрация", tags: ["Авторизация"]})
  @ApiResponse({status:201, type: TokensResponse})
  @Public()
  @Post('auth/registration')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: RegistrationUserDto, description: 'Данные пользователя'})
  @HttpCode(HttpStatus.CREATED)
  registration(@Body() userDto: RegistrationUserDto,
               @UploadedFile() file: Express.Multer.File) {
      return this.usersMService
              .send({ cmd: "registration" }, {body: {...userDto, file: {...file, buffer: file.buffer.toString('base64')}}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Выход из аккаунта", tags: ["Авторизация"]})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
      return this.usersMService
              .send({ cmd: "logout" }, {context: {userId}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Обновление токена", tags: ["Авторизация"]})
  @ApiResponse({status:200, type: TokensResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен обновления в заголовке авторизации"}])
  @Public() //Избегаем AccessTokenGuard
  @UseGuards(RefreshTokenGuard)
  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@GetCurrentUser('refreshToken') refreshToken: string ) {
      return this.usersMService
              .send({ cmd: "refresh" }, {context: {refreshToken}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Активация пользователя (Администратор, директор)", tags: ["Авторизация"]})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser", "isMailReceiver")
  @UseGuards(RolesAccessGuard)
  @Post('auth/confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Body() dto: ConfirmUserDto) {
      return this.usersMService
              .send({ cmd: "confirm" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Восстановление доступа к аккаунту", tags: ["Авторизация"]})
  @ApiResponse({status:200, description: "Успешно"})
  @Public()
  @Post('auth/forgotPassword')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: RecoverPasswordDto) {
      return this.usersMService
              .send({ cmd: "forgotPassword" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Смена пароля для восстановления доступа", tags: ["Авторизация"]})
  @ApiResponse({status:200, description: "Успешно"})
  @Public()
  @Post('auth/changePassword')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() dto: ChangePasswordDto) {
      return this.usersMService
              .send({ cmd: "changePassword" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  /* МАРШРУТЫ ДЛЯ РАБОТЫ С РОЛЯМИ */

  @ApiOperation({summary: "Создание роли (Администратор)", tags: ["Роли"]})
  @ApiResponse({status:201, type: RoleResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  createRole(@Body() dto: CreateRoleDto) {
      return this.usersMService
              .send({ cmd: "createRole" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Получение роли по уникальному значению (Администратор)", tags: ["Роли"]})
  @ApiResponse({status:200, type: RoleResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Get('roles/:value')
  @HttpCode(HttpStatus.OK)
  getRoleByValue(@Param('value') value: string) {
      return this.usersMService
              .send({ cmd: "getRoleByValue" }, {param: {value}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Получение списка всех ролей (Администратор)", tags: ["Роли"]})
  @ApiResponse({status:200, type: GetAllRolesResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Get('roles')
  @HttpCode(HttpStatus.OK)
  getAllRoles(@Query('limit') limit?: number, @Query('offset') offset?: number, @Query('search') search?: string) {
      return this.usersMService
              .send({ cmd: "getAllRoles" }, {query: {limit, offset, search}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Удаление роли (Администратор)", tags: ["Роли"]})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Delete('roles')
  @HttpCode(HttpStatus.OK)
  deleteRole(@Body() dto: DeleteRoleDto) {
      return this.usersMService
              .send({ cmd: "deleteRole" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Изменение роли (Администратор)", tags: ["Роли"]})
  @ApiResponse({status:200, type: UpdateRoleDto})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Put('roles/:value')
  @HttpCode(HttpStatus.OK)
  updateRole(@Body() dto: UpdateRoleDto, @Param('value') value: string) {
      return this.usersMService
              .send({ cmd: "updateRole" }, {body: dto, param: {value}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  /* МАРШРУТЫ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЕМ */

  @ApiOperation({summary: "Создание пользователя (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:201, type: UserResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userDto: CreateUserDto,
             @UploadedFile() file: Express.Multer.File,
             @Query('roleValue') roleValue?: string) {
    return this.usersMService
              .send({ cmd: "createUser" }, {body: {...userDto, file}, query: {roleValue}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Получение списка всех пользователей (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:200, type: GetAllUsersResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Get('users')
  @HttpCode(HttpStatus.OK)
  getAllUsers(@Query('limit') limit?: number, @Query('offset') offset?: number, @Query('search') search?: string) {
    return this.usersMService
              .send({ cmd: "getAllUsers" }, {query: {limit, offset, search}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Получение профиля авторизованого пользователя", tags: ["Пользователи"]})
  @ApiResponse({status:200, type: UserResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Get('users/profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUserId() userId: number) {
    return this.usersMService
              .send({ cmd: "getProfile" }, {context: {userId}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Изменение профиля авторизованого пользователя", tags: ["Пользователи"]})
  @ApiResponse({status:200, type: UserResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFalseFlags("isBlocked")
  @UseGuards(RolesAccessGuard)
  @Put('users/profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(@Body() dto: UpdateUserDto, @GetCurrentUserId() userId: number) {
    return this.usersMService
              .send({ cmd: "updateProfile" }, {body: dto, context: {userId}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Выдать роль пользователю (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Post('users/role')
  @HttpCode(HttpStatus.OK)
  addRoleToUser(@Body() dto: AddRoleDto) {
    return this.usersMService
              .send({ cmd: "addRoleToUser" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Убрать роль у пользователя (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Delete('users/role')
  @HttpCode(HttpStatus.OK)
  removeRoleFromUser(@Body() dto: AddRoleDto) {
    return this.usersMService
              .send({ cmd: "removeRoleFromUser" }, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Получение пользователя по id (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:200, type: UserResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: number) {
    return this.usersMService
              .send({ cmd: "getUserById" }, {param: {id}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Изменение пользователя по id (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:200, type: UserResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Put('users/:id')
  @HttpCode(HttpStatus.OK)
  updateProfileById(@Body() dto: UpdateUserAdminDto, @Param('id') id: number) {
    return this.usersMService
              .send({ cmd: "updateProfileById" }, {body: dto, param: {id}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({summary: "Удаление пользователя по id (Администратор)", tags: ["Пользователи"]})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: number) {
    return this.usersMService
              .send({ cmd: "deleteUser" }, {param: {id}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  /* МАРШРУТЫ ДЛЯ РАБОТЫ С ТВВ */

  @ApiOperation({ summary: 'Получить все точки вероятного возгорания', tags: ["Точки вероятного возгорания"] })
  @ApiResponse({ status: 200, type: FirePointsResponse })
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFalseFlags("isBlocked")
  @UseGuards(RolesAccessGuard)
  @Get('fire-points')
  @HttpCode(HttpStatus.OK)
  getFirePointsByDate(@Query('startDate') startDate: string, @Query('endDate') endDate?: string, @Query('limit') limit?: number, @Query('offset') offset?: number, @Query('satellite') satelliteName?: string) {
    return this.portalMService
              .send({ cmd: "getFirePointsByDate" }, {query: {startDate, endDate, limit, offset, satelliteName}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({ summary: 'Получить доступные даты и время', tags: ["Точки вероятного возгорания"] })
  @ApiResponse({ status: 200, type: [FirePointDatetimesResponse]})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFalseFlags("isBlocked")
  @UseGuards(RolesAccessGuard)
  @Get('fire-points/times')
  @HttpCode(HttpStatus.OK)
  getFirePointDatetimes(@Query('startDate') startDate: string, @Query('endDate') endDate?: string, @Query('satellite') satelliteName?: string, @Query('onlyDates') onlyDates?: boolean) {
    return this.portalMService
              .send({ cmd: "getFirePointDatetimes"}, {query: {startDate, endDate, satelliteName, onlyDates}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  /* МАРШРУТЫ ДЛЯ РАБОТЫ С ОЧАГАМИ ВОЗГОРАНИЯ */

  @ApiOperation({ summary: 'Получить все очаги возгорания', tags: ["Очаги возгорания"] })
  @ApiResponse({ status: 200, type: FirePolygonsResponse })
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFalseFlags("isBlocked")
  @UseGuards(RolesAccessGuard)
  @Get('fire-polygons')
  @HttpCode(HttpStatus.OK)
  getFirePolygonsByDate(@Query('startDate') startDate: string, @Query('endDate') endDate?: string, @Query('limit') limit?: number, @Query('offset') offset?: number, @Query('satellite') satelliteName?: string) {
    return this.portalMService
              .send({ cmd: "getFirePolygonsByDate" }, {query: {startDate, endDate, limit, offset, satelliteName}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({ summary: 'Получить доступные даты и время', tags: ["Очаги возгорания"] })
  @ApiResponse({ status: 200, type: [FirePolygonDatetimesResponse]})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFalseFlags("isBlocked")
  @UseGuards(RolesAccessGuard)
  @Get('fire-polygons/times')
  @HttpCode(HttpStatus.OK)
  getFirePolygontDatetimes(@Query('startDate') startDate: string, @Query('endDate') endDate?: string, @Query('satellite') satelliteName?: string, @Query('onlyDates') onlyDates?: boolean) {
    return this.portalMService
              .send({ cmd: "getFirePolygonDatetimes"}, {query: {startDate, endDate, satelliteName, onlyDates}})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  /* МАРШРУТЫ ДЛЯ РАБОТЫ С КОНТЕНТНЫМ НАПОЛНЕНИЕМ СТРАНИЦЫ "О ГЕОПОРТАЛЕ" */

  @ApiOperation({ summary: 'Получить текст страницы "О геопортале"', tags: ["О геопортале"] })
  @ApiResponse({ status: 200, type: AboutResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFalseFlags("isBlocked")
  @UseGuards(RolesAccessGuard)
  @Get('about')
  @HttpCode(HttpStatus.OK)
  getAbout() {
    return this.usersMService
              .send({cmd: "getAbout"}, {})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }

  @ApiOperation({ summary: 'Обновить текст страницы "О геопортале" (Администратор)', tags: ["О геопортале"] })
  @ApiResponse({ status: 200, type: AboutResponse})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @RoleFlags("isSuperuser")
  @UseGuards(RolesAccessGuard)
  @Put('about')
  @HttpCode(HttpStatus.OK)
  updateAbout(@Body() dto: UpdateAboutDto) {
    return this.usersMService
              .send({cmd: "updateAbout"}, {body: dto})
              .pipe(catchError(error => throwError(() => new RpcException(error))));
  }
}
