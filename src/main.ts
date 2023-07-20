import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './utils/config';
import { Sequelize } from 'sequelize';

Sequelize['DATE'].prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};

async function startServer() {
  const PORT = config[process.env.NODE_ENV].port;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
startServer();
