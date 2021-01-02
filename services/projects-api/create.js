import uuid from "uuid";
import dynamoDb from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      projectId: uuid.v1(),
      projectName: data.projectName,
      projectDescription: data.projectDescription || null,
      projectTodos: data.projectTodos || [],
      isActive: data.isActive,
      attachment: data.attachment || null,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    },
  };

  try {
    await dynamoDb.put(params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
