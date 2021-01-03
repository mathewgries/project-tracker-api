import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      projectId: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: `SET
    projectName = :projectName,
    projectDescription = :projectDescription,
    projectTodos = :projectTodos,
    isActive = :isActive,
    attachment = :attachment
    modifiedAt = :modifiedAt`,
    ExpressionAttributeValues: {
      ":projectName": data.projectName,
      ":projectDescription": data.projectDescription || null,
      ":projectTodos": data.projectTodos || [],
      ":isActive": data.isActive,
      ":attachment": data.attachment || null,
      ":modifiedAt": Date.now(),
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return { status: true };
});
