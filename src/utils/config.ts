export const config = {
  development: {
    port: 3000,
    database: {
      username: 'postgres',
      password: 'root',
      database: 'docs_dump',
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
    },
    databaseMSSQL: {
      username: 'webuser',
      password: 'G745JRQ8!',
      database: 'ELR_Orders',
      host: '10.11.62.70',
      dialect: 'mssql',
      port: 1433,
      logging: false,
    },
    server: {
      protocol: 'http',
      host: '192.168.0.228',
      port: 8082,
      errorRestartIntervalInMinutes: 1,
      resetDatabaseOnRestart: false,
      requestMaxSize: '100mb',
      urlPrefix: '/api',
    },
    services: {
      gatewayDecode: 'http://10.11.62.74:3000/decode',
      users: 'http://10.11.62.74:3000/service/users/graphql',
      templater: 'http://10.11.13.224:8777/api/template',
      mailer: 'http://10.11.62.74:3000/mailer/employeeNumber',
    },
  },
};
