import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorDto } from './common/dto/error.dto';
import { OutputDto } from './common/dto/output.dto';
import { SocketIOAdapter } from './socket-io-adapter';

export function configureApp(app: INestApplication): number {
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'));
  const clientPort = parseInt(configService.get('CLIENT_PORT'));

  // Add HTTPS CORS globally
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
  });

  // Add WebSocket adapter globally to enable specific CORS
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  // Add validation using class-validator globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Add swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Crash Game API')
    .setDescription('The Crash Game API description')
    .setVersion('1.0')
    .addTag('crashGame')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [OutputDto, ErrorDto],
  });
  SwaggerModule.setup('api', app, document);

  return port;
}

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = configureApp(app);

  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
