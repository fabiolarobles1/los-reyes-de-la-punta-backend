// lambda.ts
import { Handler, Context, APIGatewayEvent } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const express = require('express')();

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this
// is likely due to a compressed response (e.g. gzip) which has not
// been handled correctly by aws-serverless-express and/or API
// Gateway. Add the necessary MIME types to binaryMimeTypes below
// const binaryMimeTypes: string[] = [];

const isProduction = process.env.NODE_ENV === 'production';
let cachedServer: Server;

// Create the Nest.js server and convert it into an Express.js server
async function bootstrapServer(): Promise<Server> {
  return NestFactory.create(AppModule, new ExpressAdapter(express))
    .then((nestApp) => {
      nestApp.use(eventContext());
      const options = {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: '*',
        preflightContinue: false,
        credentials: true,
        optionsSuccessStatus: 200
      }
      nestApp.enableCors(options);
      return nestApp.init();
    })
    .then(() => {
      return createServer(express);
    });
}

// Export the handler : the entry point of the Lambda function
export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
//   if (isProduction && event.source === 'serverless-plugin-warmup') {
//     return 'Lambda is warm!';
//   }

  if (!isProduction && event.body && event.headers['Content-Type'].includes('multipart/form-data')) {
    event.body = (Buffer.from(event.body, 'binary') as unknown) as string;
  }

  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return proxy(cachedServer, event, context, 'PROMISE').promise;
};