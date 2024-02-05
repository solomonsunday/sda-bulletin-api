import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/error/filter/all-exception.filter';
import { HttpExceptionFilter } from './common';

export async function bootstrapApplication(isLambda = false) {
  const application = await NestFactory.create(AppModule);
  application.setGlobalPrefix('api');
  application.enableCors();
  application.use(helmet());
  application.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  application.useGlobalFilters(
    new AllExceptionFilter(),
    new HttpExceptionFilter(),
  );
  return { application };
}
