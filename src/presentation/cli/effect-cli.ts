import { Args, Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";
import type { DocumentService } from "../../app/services/documentService";
import { AppDataSource } from "../../infra/db/typeOrm/dataSource";
import container from "../../infra/di/inversify/inversify.config";
import { TYPES } from "../../infra/di/inversify/types";

await AppDataSource.initialize();
const concurrency = Args.integer({ name: "concurrency" });
const documentService = container.get<DocumentService>(TYPES.DocumentService);
const emailDocumentsCommand = Command.make(
	"emailDocuments",
	{ concurrency },
	({ concurrency }) => {
		const emailDocumentsRequest = { concurrency };
		const response = documentService.emailDocuments(
			emailDocumentsRequest,
			"admin",
		);

		const responseMatch = Effect.match(response, {
			onSuccess: () => Console.log("Documents emailed successfully"),
			onFailure: (error) =>
				Console.error(`Failed to email documents: ${error.message}`),
		});

		return responseMatch;
	},
);

const cli = Command.run(emailDocumentsCommand, {
	name: "Document CLI",
	version: "v0.0.1",
});

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
