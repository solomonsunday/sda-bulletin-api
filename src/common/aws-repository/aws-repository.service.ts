import { Inject, Injectable } from '@nestjs/common';
import {
  DescribeTableCommand,
  DescribeTableCommandInput,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
  TranslateConfig,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { marshallOptions, unmarshallOptions } from '@aws-sdk/util-dynamodb';

import {
  IPutCommandInput,
  IPutCommandOutput,
  IGetCommandInput,
  IGetCommandOutput,
  IBatchGetCommandInput,
  IBatchGetCommandOutput,
  IQueryCommandInput,
  IQueryCommandOutput,
  IUpdateCommandInput,
  IUpdateCommandOutput,
  IBatchWriteCommandInput,
  IBatchWriteCommandOutput,
  IDeleteCommandInput,
  IDeleteCommandOutput,
} from './aws-dynamo-operation.interface';
import { UtilityService } from '../utility';
import { EnvironmentConfig } from '../configuration';

@Injectable()
export class AwsRepositoryService {
  private dynamoDbFullClient: DynamoDBDocumentClient;

  @Inject() private readonly utilityService: any;

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
  async runPutCommand<TResponse>(
    putParam: IPutCommandInput<TResponse>,
  ): Promise<IPutCommandOutput<TResponse>> {
    const responseData = await this.DynamoDbInstance().send(
      new PutCommand({
        ...putParam,
        TableName:
          putParam.TableName ||
          EnvironmentConfig.WORKINANCE_AWS_DYNAMODB_TABLE_NAME,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
    responseData['Result'] = putParam.Item as TResponse;
    return responseData as IPutCommandOutput<TResponse>;
  }

  /*dynamo-db get command */
  async runGetCommand<TResponse>(
    getParam: IGetCommandInput<TResponse>,
  ): Promise<IGetCommandOutput<TResponse>> {
    const responseData = await this.DynamoDbInstance().send(
      new GetCommand({
        ...getParam,
        TableName:
          getParam.TableName ||
          EnvironmentConfig.WORKINANCE_AWS_DYNAMODB_TABLE_NAME,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    );
    responseData['Result'] = responseData.Item as TResponse;
    return responseData as IGetCommandOutput<TResponse>;
  }

  /*dynamo-db batch get command */
  async runBatchGetCommand<TResponse>({
    batchGetParam,
    returnAllAtOnce = false,
  }: {
    batchGetParam: IBatchGetCommandInput<TResponse>;
    returnAllAtOnce?: boolean;
  }) {
    // https://dynobase.dev/dynamodb-batch-write-update-delete/
    let queryResponse: BatchGetCommandOutput;
    let responseData: TResponse[] = [];
    // batchGetParam.ConsistentRead = true;
    const newBatchParam = (await this.utilityService.SanitizeObject({
      data: { ...batchGetParam },
      keysToRemove: ['TableName'],
    })) as Omit<IBatchGetCommandInput<TResponse>, 'TableName'>;

    const paramFieldsToString = newBatchParam.Keys.map((key) =>
      JSON.stringify(key),
    );
    const sanitizedParamStrings = [...new Set(paramFieldsToString)];
    const sanitizedDuplicateBatchParam = sanitizedParamStrings
      .map<typeof newBatchParam.Keys>((item) => JSON.parse(item))
      .flat(); //.map(data=>);

    newBatchParam.Keys = [...sanitizedDuplicateBatchParam];

    do {
      const batchQueryInput: BatchGetCommandInput = {
        RequestItems: {
          [batchGetParam.TableName]: { ...newBatchParam },
        },
      };
      queryResponse = await this.DynamoDbInstance().send(
        new BatchGetCommand({
          ...batchQueryInput,
          ReturnConsumedCapacity: 'TOTAL',
        }),
      );
      responseData = [
        ...responseData,
        ...(queryResponse.Responses[batchGetParam.TableName] as TResponse[]),
      ];
      batchQueryInput.RequestItems = queryResponse.UnprocessedKeys;
    } while (
      queryResponse.UnprocessedKeys &&
      Object.keys(queryResponse.UnprocessedKeys).length
    );
    return {
      ...queryResponse,
      // Responses: responseData,
      Results: responseData,
    } as IBatchGetCommandOutput<TResponse>;
  }

  // https://medium.com/cloud-native-the-gathering/querying-dynamodb-by-date-range-899b751a6ef2
  // https://stackoverflow.com/questions/61796423/dynamodb-query-contains-on-a-list-parameter
  // https://dynobase.dev/dynamodb-pagination
  /**dynamo-db query commands
   *
   * @param returnAllAtOnce:  if set to true, it returns all without limit .Else, it returns return the current data limit and pagination information.
   * @default returnAllAtOnce: false
   */
  async runQueryCommand<TResponse>({
    queryParam,
    returnAllAtOnce = false,
  }: {
    queryParam: IQueryCommandInput<TResponse>;
    returnAllAtOnce?: boolean;
  }): Promise<IQueryCommandOutput<TResponse>> {
    let queryResponse: QueryCommandOutput;
    let responseData: TResponse[] = [];
    do {
      queryResponse = await this.DynamoDbInstance().send(
        new QueryCommand({
          ...queryParam,
          TableName:
            queryParam.TableName ||
            EnvironmentConfig.WORKINANCE_AWS_DYNAMODB_TABLE_NAME,
          ReturnConsumedCapacity: 'TOTAL',
        }),
      );
      responseData = [...responseData, ...(queryResponse.Items as TResponse[])];
      queryParam.ExclusiveStartKey =
        queryResponse.LastEvaluatedKey as TResponse;
    } while (
      queryResponse.LastEvaluatedKey &&
      Object.keys(queryResponse.LastEvaluatedKey).length &&
      returnAllAtOnce
    );
    queryResponse.Items = responseData;
    queryResponse['Results'] = responseData;
    return queryResponse as IQueryCommandOutput<TResponse>;
  }

  /*dynamo-db update command */
  // https://stackoverflow.com/questions/55790894/dynamodb-timestamp-reserved-name-expression-attribute-name
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.Multiple
  async runUpdateCommand<TResponse>(
    updateParam: IUpdateCommandInput<TResponse>,
  ): Promise<IUpdateCommandOutput<TResponse>> {
    const result = await this.DynamoDbInstance().send(
      new UpdateCommand({
        ...updateParam,
        ReturnConsumedCapacity: 'TOTAL',
        ReturnValues: 'ALL_NEW',
      }),
    );
    result['Result'] = result.Attributes;
    return result as IUpdateCommandOutput<TResponse>;
  }

  /*dynamo-db batch update command */
  async runBatchUpdateCommand(
    batchUpdateParam: IBatchWriteCommandInput,
  ): Promise<IBatchWriteCommandOutput> {
    return this.DynamoDbInstance().send(
      new BatchWriteCommand({
        ...batchUpdateParam,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    ) as unknown as IBatchWriteCommandOutput;
  }

  /*dynamo-db delete command */
  async runDeleteCommand(
    deleteParam: IDeleteCommandInput,
  ): Promise<IDeleteCommandOutput> {
    return this.DynamoDbInstance().send(
      new DeleteCommand({
        ...deleteParam,
        ReturnConsumedCapacity: 'TOTAL',
      }),
    ) as unknown as IDeleteCommandOutput;
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
