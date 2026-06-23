import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
          new ValidationPipe({
              whitelist:true, // Ignore any properties that do not have any validation decorators
              forbidNonWhitelisted:true, // Throws an error (Bad Request) if non-whitelisted properties are present
              stopAtFirstError:true, // To return only the first error message if the property have more than one decorator 
              errorHttpStatusCode:401, // Control status code
          })) // to process at all APIs in this app <<GLOBAL>>
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
