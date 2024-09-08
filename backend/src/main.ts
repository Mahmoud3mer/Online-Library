import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  app.useGlobalPipes(new ValidationPipe()); // Validation
=======
  app.useGlobalPipes(new ValidationPipe());
>>>>>>> 945094a30b1fd6c10f26d7307aaa6fa7613b4236
  await app.listen(3000);
}
bootstrap();
