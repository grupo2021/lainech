import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigOptions } from './config/config';
import generateTypeormConfigFile from './scripts/generate-typeormconfig';
import setDefaultData from './scripts/set-default-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const configService = app.get(ConfigService);
  // generate ormconfig.json
  generateTypeormConfigFile(configService);

  // generate default data
  setDefaultData(configService);

  const port = configService.get(ConfigOptions.port);
  await app.listen(port);
}
bootstrap();
