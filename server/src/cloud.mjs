import app from "./app.mjs";
import serverless from "serverless-http";

export const lambdaHandler = serverless(app);
