// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
// import { marshallOptions } from '@aws-sdk/util-dynamodb';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { SignUpDto } from 'src/core';
import { v4 as uuidv4 } from 'uuid';

// export class DefaultEventDataLog {
//   // private environment: EnvironmentType;
//   private dynamoDBClient: DynamoDBDocumentClient;
//   private marshallOptions: marshallOptions = {
//     convertEmptyValues: false,
//     removeUndefinedValues: false,
//     convertClassInstanceToMap: false,
//   };
//   constructor(region: string, environment: EnvironmentType) {
//     // this.environment = environment;
//     const dynamoClient = new DynamoDBClient({ region: this.region });
//     this.dynamoDBClient = DynamoDBDocumentClient.from(dynamoClient, {
//       marshallOptions: this.marshallOptions,
//       unmarshallOptions: { wrapNumbers: false },
//     });
//   }
//   // This method creates a log for every actions performed in this Library
//   // It also logs failure and reasons
//   async create(logData: EventLogDto) {
//     await this.dynamoDBClient.send(
//       new PutCommand({
//         TableName: 'LS-Data-Event-Source-Library-' + this.environment,
//         Item: {
//           id: _uuid.v4(),
//           created_date: new Date().toISOString(),
//           ...logData,
//         },
//       }),
//     );
//   }
// }

export class DynamoConfig {
  client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'AKIAU6GDWNX2DZ4WHU3I',
      secretAccessKey: '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',
    },
  });
  async create(signUpDto: SignUpDto) {
    await this.client.send(
      new PutCommand({
        TableName: 'ogbachurchbulletin',
        Item: {
          id: uuidv4(),
          entityName: 'user',
          createdDate: new Date().toISOString(),
          ...signUpDto,
        },
      }),
    );
  }
}
