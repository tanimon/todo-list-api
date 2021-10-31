import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AWS from 'aws-sdk';

const signer = new AWS.RDS.Signer();
const signerOptions = {
  region: process.env.AWS_REGION,
  hostname: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  port: 3306,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      synchronize: true,
      ssl: 'Amazon RDS',
      extra: {
        authPlugins: {
          mysql_clear_password: () => () => signer.getAuthToken(signerOptions),
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
