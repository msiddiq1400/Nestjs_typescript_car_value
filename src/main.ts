import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['asdasd'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra unwanted data from requests
    }),
  );
  await app.listen(3000);
}
bootstrap();
