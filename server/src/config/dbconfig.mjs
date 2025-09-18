import dynamoose from "dynamoose";

if (process.env.LOCAL) {
  const dynamoEndpoint = process.env.DYNAMO_ENDPOINT;

  const ddb = new dynamoose.aws.ddb.DynamoDB({
    endpoint: dynamoEndpoint ?? undefined,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
    },
    region: "eu-north-1",
  });
  dynamoose.aws.ddb.set(ddb);
}

export default dynamoose;
