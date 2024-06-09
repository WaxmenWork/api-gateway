import { Module } from '@nestjs/common';
import { ApiGatewayV1Module } from './api-gateway-v1/api-gateway-v1.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { AccessTokenStrategy, RefreshTokenStrategy } from './common/strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ApiGatewayV1Module,
    JwtModule.register({}),
  ]
})
export class AppModule {}
