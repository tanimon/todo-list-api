import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const baseOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
};
const port = 3306;

const signer = new AWS.RDS.Signer();
const signerOptions = {
  region: process.env.AWS_REGION,
  hostname: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  port,
};

const productionOptions: TypeOrmModuleOptions = {
  ...baseOptions,
  ssl: 'Amazon RDS',
  extra: {
    authPlugins: {
      mysql_clear_password: () => () => signer.getAuthToken(signerOptions),
    },
  },
};

const localOptions: TypeOrmModuleOptions = {
  ...baseOptions,
  port,
  password: process.env.DB_PASSWORD,
};

export default process.env.NODE_ENV === 'production'
  ? productionOptions
  : localOptions;
