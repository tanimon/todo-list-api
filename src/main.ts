import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let cachedServer: Handler;

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ToDo list API')
    .setDescription(
      'This is an API documentation of a simple ToDo list API server.',
    )
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrapHandler(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (event.path === '/api') {
    event.path = '/api/';
  }
  event.path = event.path.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;

  cachedServer = cachedServer ?? (await bootstrapHandler());
  return cachedServer(event, context, callback);
};
