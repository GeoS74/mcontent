require('dotenv').config({ path: './secret.env' });

module.exports = {
  node: {
    env: process.env.NODE_ENV || 'dev',
  },
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || 3020,
  },
  mongodb: {
    autoindex: process.env.CREATE_AUTOINDEX || (process.env.NODE_ENV === 'dev'),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 27017,
    database: process.env.DB_NAME || 'mcontent',
  },
  jwt: {
    check: process.env.JWT_CHECK === 'true',
    secretKey: process.env.JWT_SECRET_KEY || 'any_secret',
  },
  log: {
    file: 'app.log',
  },
  koaBodyOptional: {
    formidable: {
      uploadDir: './files',
      allowEmptyFiles: false,
      minFileSize: 1,
      multiples: true,
      hashAlgorithm: 'md5',
      keepExtensions: true,
    },
    multipart: true,
  },
};
