import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './utils/config';

async function startServer() {
  const PORT = config[process.env.NODE_ENV].port;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
startServer();
