import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayV1Controller } from './api-gateway-v1.controller';

describe('ApiGatewayV1Controller', () => {
  let controller: ApiGatewayV1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayV1Controller],
    }).compile();

    controller = module.get<ApiGatewayV1Controller>(ApiGatewayV1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
