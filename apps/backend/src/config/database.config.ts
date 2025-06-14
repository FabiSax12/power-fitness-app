import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 30000,
    requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT, 10) || 30000,
    enableArithAbort: true,
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
    max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10) || 30000,
  },
  logging: {
    queries: process.env.DB_LOG_QUERIES === 'true',
    level: process.env.LOG_LEVEL || 'info',
  }
}));