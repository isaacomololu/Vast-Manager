import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config, setupConfig } from './common';

async function bootstrap() {
  const error = await setupConfig();
  if (error) throw error;

  const app = await NestFactory.create(AppModule, { snapshot: true });
  app.enableCors();

  const swaggarConfig = new DocumentBuilder()
    .setTitle('VAST API')
    .addBearerAuth({ type: 'http' }, 'jwt')
    .build();
  SwaggerModule.setup(
    '/api/documentation',
    app,
    SwaggerModule.createDocument(app, swaggarConfig),
    {
      swaggerOptions: { persistAuthorization: true }
    }
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 8080);

  if (config.NODE_ENV == 'development' || config.NODE_ENV == 'staging') {
    const link = config.BASE_URL;
    const docLink = `${link}/api/documentation`;
    console.log(`Vast Manager is running on: ${link}`);
    console.log(`Swagger documentation: ${docLink}`);
  }
}
bootstrap();
