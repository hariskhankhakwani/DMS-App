import { OpenAPIHandler } from "@orpc/openapi/node";
import { RPCHandler } from "@orpc/server/node";

import { OpenAPIGenerator } from "@orpc/openapi";
import { os } from "@orpc/server";
import { ZodAutoCoercePlugin, ZodToJsonSchemaConverter } from "@orpc/zod";
import express from "express";
import * as swaggerUi from "swagger-ui-express";
import { documentContract } from "./contracts/documentContract";
import { userContract } from "./contracts/userContract";
import { errorMiddleware } from "./middleware/errorMiddleware";
import documentRoutes, { documentRouter } from "./routes/documentRoutes";
import userRoutes, { userRouter } from "./routes/userRoutes";
const openAPIGenerator = new OpenAPIGenerator({
	schemaConverters: [new ZodToJsonSchemaConverter()],
});
const app = express();

const apiRouter = os.router({
	user: userRouter,
	document: documentRouter,
});

const apiOpenAPIHandler = new OpenAPIHandler(apiRouter, {
	plugins: [new ZodAutoCoercePlugin()],
});

app.use("/api/*", async (req, res, next) => {
	const { matched } = await apiOpenAPIHandler.handle(req, res, {
		prefix: "/api",
		context: {},
	});

	if (matched) {
		return;
	}

	next();
});

const rpcHandler = new RPCHandler(apiRouter);

app.use("/rpc/*", async (req, res, next) => {
	const { matched } = await rpcHandler.handle(req, res, {
		prefix: "/rpc",
		context: {},
	});

	if (matched) {
		return;
	}

	next();
});

const openApiDocumentUser = await openAPIGenerator.generate(apiRouter, {
	info: {
		title: "Document Management System API  Endpoints",
		version: "1.0.0",
		description: "API for managing users",
		contact: {
			name: "API Support",
		},
	},
	servers: [
		{
			url: "http://localhost:3000/api",
			description: "Local development server",
		},
	],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentUser));

export default app;
