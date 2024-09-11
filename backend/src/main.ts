
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, token',  

  });
  app.useGlobalPipes(new ValidationPipe());

  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
  });
    //! تفعيل CORS
  app.enableCors({
    origin: 'http://localhost:4200', //! أو يمكنك تحديد نطاقات محددة للسماح بها
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  // app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
