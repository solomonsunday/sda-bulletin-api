import {
  APIGatewayProxyCallbackV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Context,
} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { bootstrapApplication } from './app';

let serverInstance: APIGatewayProxyHandlerV2;

async function bootstrapLambdaApi(): Promise<APIGatewayProxyHandlerV2<never>> {
  if (!serverInstance) {
    const { application } = await bootstrapApplication(true);
    await application.init();
    const expressInstance = application.getHttpAdapter().getInstance();
    serverInstance = serverlessExpress({ app: expressInstance });
  }
  return serverInstance;
}

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: APIGatewayProxyCallbackV2,
) {
  const server = await bootstrapLambdaApi();
  return server(event, context, callback);
}
