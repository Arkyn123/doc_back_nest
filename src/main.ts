import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './utils/config';

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
bootstrap();
