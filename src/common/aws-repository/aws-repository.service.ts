import { Injectable } from '@nestjs/common';
import {
  DescribeTableCommand,
  DescribeTableCommandInput,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  TranslateConfig,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { marshallOptions, unmarshallOptions } from '@aws-sdk/util-dynamodb';
import { EnvironmentConfig } from '../configuration';

@Injectable()
export class AwsRepositoryService {
  private dynamoDbFullClient: DynamoDBDocumentClient;

  private marshallOptions: marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to null.
    convertEmptyValues: false, // false, by default.

    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.

    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  };

  private unmarshallOptions: unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  };

  private translateConfig: TranslateConfig = {
    marshallOptions: this.marshallOptions,
    unmarshallOptions: this.unmarshallOptions,
  };

  // - https://www.alexdebrie.com/posts/dynamodb-limits/

  /** dynamo-db put command */
  async runPutCommand<TResponse extends Record<string, any>>(
    putParam: PutCommandInput,
  ) {
    const responseData = await this.DynamoDbInstance().send(
      new PutCommand({
        ...putParam,
        TableName: putParam.TableName || process.env.TABLE_NAME,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
    responseData['Result'] = putParam.Item;
    return responseData as PutCommandOutput & { Result: TResponse };
  }

  /*dynamo-db get command */
  async runGetCommand(getParam: any) {
    return await this.DynamoDbInstance().send(
      new GetCommand({
        ...getParam,
        TableName: getParam.TableName || EnvironmentConfig.TABLE_NAME,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
  }

  // https://medium.com/cloud-native-the-gathering/querying-dynamodb-by-date-range-899b751a6ef2
  // https://stackoverflow.com/questions/61796423/dynamodb-query-contains-on-a-list-parameter
  // https://dynobase.dev/dynamodb-pagination
  /**dynamo-db query commands
   *
   * @param returnAllAtOnce:  if set to true, it returns all without limit .Else, it returns return the current data limit and pagination information.
   * @default returnAllAtOnce: false
   */
  async runQueryCommand(
    queryParam: QueryCommandInput,
  ): Promise<QueryCommandOutput> {
    return await this.DynamoDbInstance().send(
      new QueryCommand({
        ...queryParam,
        TableName: queryParam.TableName || EnvironmentConfig.TABLE_NAME,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
  }

  /*dynamo-db update command */
  // https://stackoverflow.com/questions/55790894/dynamodb-timestamp-reserved-name-expression-attribute-name
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.Multiple
  async runUpdateCommand(updateParam: any) {
    return await this.DynamoDbInstance().send(
      new UpdateCommand({
        ...updateParam,
        ReturnConsumedCapacity: 'TOTAL',
        ReturnValues: 'ALL_NEW',
      }),
    );
  }

  /*dynamo-db batch update command */
  async runBatchUpdateCommand(batchUpdateParam: any) {
    return this.DynamoDbInstance().send(
      new BatchWriteCommand({
        ...batchUpdateParam,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    ) as unknown as any;
  }

  /*dynamo-db delete command */
  async runDeleteCommand(deleteParam: any) {
    return this.DynamoDbInstance().send(
      new DeleteCommand({
        ...deleteParam,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
  }

  /*dynamo-db batch delete command /
	async runBatchDeleteCommand(updateParam: IBatchWriteCommandInput) {
		// TODO

	}


	/*get dynamo-db table information */
  async getTableDetials(tableDetailsParam: DescribeTableCommandInput) {
    return this.DynamoDbInstance().send(
      new DescribeTableCommand({
        ...tableDetailsParam,
      }),
    );
  }

  private DynamoDbInstance(): DynamoDBDocumentClient {
    if (!this.dynamoDbFullClient) {
      const dynamoClient = new DynamoDBClient({
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'AKIAU6GDWNX2DZ4WHU3I',
          secretAccessKey: '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',
        },
      });
      this.dynamoDbFullClient = DynamoDBDocumentClient.from(
        dynamoClient,
        this.translateConfig,
      );
    }
    return this.dynamoDbFullClient;
  }
}
