import { Module } from '@nestjs/common';
import { ApiGatewayV1Controller } from './api-gateway-v1.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [ApiGatewayV1Controller],
  imports: [
    ClientsModule.register([
      {
        name: "USERS_MS",
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_MS_HOST || "main",
          port: parseInt(process.env.USERS_MS_PORT) || 8001
        }
      },
      {
        name: "PORTAL_MS",
        transport: Transport.TCP,
        options: {
          host: process.env.PORTAL_MS_HOST || "portal-ms",
          port: parseInt(process.env.PORTAL_MS_PORT) || 8002
        }
      }
    ])
  ]
})
export class ApiGatewayV1Module {}
