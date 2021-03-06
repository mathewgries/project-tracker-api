import handler from "../../libs/handler-lib";
import uuid from "uuid";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      projectId: uuid.v1(),
      groupId: data.groupId || null,
      title: data.title,
      description: data.description || null,
      isActive: data.isActive,
      position: data.position,
      attachment: data.attachment || null,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    },
  };
  await dynamoDb.put(params);

  return params.Item;
});
