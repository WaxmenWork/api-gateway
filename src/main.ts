import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './common/pipes';
import { RpcExceptionToHttpExceptionFilter } from './common/filters';

async function start() {
  const PORT = process.env.PORT || 5002;
  const app = await NestFactory.create(AppModule, {cors: {credentials: true, methods:"POST,GET,PUT,DELETE,PATCH,OPTIONS,HEAD,TRACE,CONNECT"}});

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RpcExceptionToHttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Api gateway')
    .setDescription('Документация серверной части геопорала "Спутниковый мониторинг Байкальской природной территории"')
    .setVersion('1.0.0')
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Api-gateway started on port ${PORT}`));
}

start();