import { config } from '../utils/config';
import { Sequelize } from 'sequelize';

let databaseMSSQL;
if (config[process.env.NODE_ENV].databaseMSSQL.use_env_variable) {
  databaseMSSQL = new Sequelize(
    process.env[config[process.env.NODE_ENV].databaseMSSQL.use_env_variable],
    {
      dialect: 'mssql',
      dialectOptions: {
        options: {
          encrypt: false,
        },
      },
    },
  );
} else {
  databaseMSSQL = new Sequelize(
    config[process.env.NODE_ENV].databaseMSSQL.database,
    config[process.env.NODE_ENV].databaseMSSQL.username,
    config[process.env.NODE_ENV].databaseMSSQL.password,
    {
      host: config[process.env.NODE_ENV].databaseMSSQL.host,
      port: config[process.env.NODE_ENV].databaseMSSQL.port,
      dialect: 'mssql',
      dialectOptions: {
        options: {
          encrypt: false,
        },
      },
    },
  );
}

export { databaseMSSQL };
