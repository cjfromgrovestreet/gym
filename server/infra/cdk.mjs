#!/usr/bin/env node
import { App, Stack, Duration, CfnOutput } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HttpApi, CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import path from "path";
import { fileURLToPath } from "url";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ExpressApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const exerciseTable = new dynamodb.Table(this, "ExerciseTable", {
      tableName: "Exercise",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecovery: false,
    });

    const userTable = new dynamodb.Table(this, "UserTable", {
      tableName: "User",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecovery: false,
    });

    const workoutTable = new dynamodb.Table(this, "WorkoutTable", {
      tableName: "Workout",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecovery: false,
    });

    const serverFunction = new NodejsFunction(this, "ServerFunction", {
      entry: path.resolve(__dirname, "../src/cloud.mjs"),
      handler: "lambdaHandler",
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 512,
      timeout: Duration.seconds(10),
      bundling: {
        minify: true,
        sourcesContent: false,
        externalModules: ["aws-sdk"],
      },
    });

    const api = new HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowOrigins: ["*"],
        allowHeaders: ["*"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.OPTIONS,
        ],
      },
    });

    exerciseTable.grantReadWriteData(serverFunction);
    userTable.grantReadWriteData(serverFunction);
    workoutTable.grantReadWriteData(serverFunction);

    api.addRoutes({
      path: "/{proxy+}",
      integration: new HttpLambdaIntegration(
        "ApiLambdaIntegration",
        serverFunction
      ),
    });

    new CfnOutput(this, "Backend URL: ", { value: api.apiEndpoint });
  }
}

const app = new App();
new ExpressApiStack(app, "Gym", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "eu-north-1",
  },
});
