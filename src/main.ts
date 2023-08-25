import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Transactions Flow')
    .setDescription('Transactions Flow API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalFilters(new CustomExceptionFilter());
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
