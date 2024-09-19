import { Injectable } from '@nestjs/common';
import {
  DescribeTableCommand,
  DescribeTableCommandInput,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  TranslateConfig,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { marshallOptions, unmarshallOptions } from '@aws-sdk/util-dynamodb';
import { EnvironmentConfig } from '../configuration';
import { EntityName } from '../enum';
import { CachingService } from '../caching/caching.service';
import { IBulletin } from 'src/core/bulletin/entities/bulletin.interface';

@Injectable()
export class AwsRepositoryService {
  constructor(private readonly cachingService: CachingService) {}
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
    putParam: Omit<PutCommandInput, 'TableName'> &
      Partial<Pick<PutCommandInput, 'TableName'>>,
  ) {
    const responseData = await this.DynamoDbInstance().send(
      new PutCommand({
        ...putParam,
        TableName: putParam.TableName || 'ogba-church-bulletin-development',
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
    responseData['Result'] = putParam.Item;
    return responseData as PutCommandOutput & { Result: TResponse };
  }

  async getItemByID<TEntity extends Record<string, any>>({
    id,
    entityName,
  }: {
    id: string;
    entityName: EntityName.BULLETIN;
  }) {
    let data = null;
    const cachedData = await this.cachingService.getCahedData(id);
    data = cachedData;
    if (cachedData === null) {
      const getParam: GetCommandInput = {
        TableName: '',
        Key: { id, entityName },
      };

      const res = await this.runGetCommand(getParam);
      const resultData = res.Result ? { ...res.Result } : null;
      await this.cachingService.setDataToCache(id, resultData as IBulletin);
      data = resultData;
    }
    return data;
  }

  /*dynamo-db get command */
  async runGetCommand<TResponse extends Record<string, any>>(
    getParam: Omit<GetCommandInput, 'TableName'> &
      Partial<Pick<GetCommandInput, 'TableName'>>,
  ) {
    const responseData = await this.DynamoDbInstance().send(
      new GetCommand({
        ...getParam,
        TableName: getParam.TableName || 'ogba-church-bulletin-development',
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
    responseData['Result'] = responseData.Item;
    return responseData as GetCommandOutput & { Result: TResponse };
  }

  // https://medium.com/cloud-native-the-gathering/querying-dynamodb-by-date-range-899b751a6ef2
  // https://stackoverflow.com/questions/61796423/dynamodb-query-contains-on-a-list-parameter
  // https://dynobase.dev/dynamodb-pagination
  /**dynamo-db query commands
   *
   * @param returnAllAtOnce:  if set to true, it returns all without limit .Else, it returns return the current data limit and pagination information.
   * @default returnAllAtOnce: false
   */
  async runQueryCommand<TResponse extends Record<string, any>>(
    queryParam: Omit<QueryCommandInput, 'TableName'> &
      Partial<Pick<QueryCommandInput, 'TableName'>>,
  ) {
    const queryResult = await this.DynamoDbInstance().send(
      new QueryCommand({
        ...queryParam,
        TableName: queryParam.TableName || 'ogba-church-bulletin-development',
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
    queryResult['Results'] = queryResult.Items;
    return queryResult as QueryCommandOutput & { Result: TResponse };
  }

  /*dynamo-db update command */
  // https://stackoverflow.com/questions/55790894/dynamodb-timestamp-reserved-name-expression-attribute-name
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.Multiple
  async runUpdateCommand(
    updateParam: Omit<UpdateCommandInput, 'TableName'> &
      Partial<Pick<UpdateCommandInput, 'TableName'>>,
  ) {
    return await this.DynamoDbInstance().send(
      new UpdateCommand({
        ...updateParam,
        ReturnConsumedCapacity: 'TOTAL',
        TableName: updateParam.TableName || 'ogba-church-bulletin-development',
        ReturnValues: 'ALL_NEW',
      }),
    );
  }

  /*dynamo-db batch update command */
  async runBatchGetCommand<IResponse>(batchUpdateParam: BatchGetCommandInput) {
    return this.DynamoDbInstance().send(
      new BatchGetCommand({
        ...batchUpdateParam,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
  }

  /*dynamo-db delete command */
  async runDeleteCommand(
    deleteParam: Omit<DeleteCommandInput, 'TableName'> &
      Partial<Pick<DeleteCommandInput, 'TableName'>>,
  ) {
    return this.DynamoDbInstance().send(
      new DeleteCommand({
        ...deleteParam,
        TableName: deleteParam.TableName || 'ogba-church-bulletin-development',
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
  }

  /*dynamo-db batch delete command /
	async runBatchDeleteCommand(updateParam: IBatchWriteCommandInput) {
		// TODO

	}


	/*get dynamo-db table information */
  async getTableDetials(
    tableDetailsParam: Omit<DescribeTableCommandInput, 'TableName'> &
      Partial<Pick<DescribeTableCommandInput, 'TableName'>>,
  ) {
    return this.DynamoDbInstance().send(
      new DescribeTableCommand({
        TableName:
          tableDetailsParam.TableName || 'ogba-church-bulletin-development',
        ...tableDetailsParam,
      }),
    );
  }

  private DynamoDbInstance(): DynamoDBDocumentClient {
    if (!this.dynamoDbFullClient) {
      const dynamoClient = new DynamoDBClient({
        region: 'us-east-1',
        credentials: {
          accessKeyId: EnvironmentConfig.APP_ACCESS_KEY_ID,
          secretAccessKey: EnvironmentConfig.APP_SECRET_ACCESS_KEY,
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
