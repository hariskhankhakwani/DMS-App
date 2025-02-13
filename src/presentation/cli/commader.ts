import { Args } from "@effect/cli";
import { eachLimit, eachOfLimit } from "async";
import { Command } from "commander";
import { Effect } from "effect";
import type { DocumentService } from "../../app/services/documentService";
import { AppDataSource } from "../../infra/db/typeOrm/dataSource";
import container from "../../infra/di/inversify/inversify.config";
import { TYPES } from "../../infra/di/inversify/types";

const program = new Command();

await AppDataSource.initialize();
const documentService = container.get<DocumentService>(TYPES.DocumentService);
program
	.name("emailDocuments")
	.option("-c, --concurrency <number>", "Concurrency", Number.parseInt)
	.action(async (options) => {
		const concurrency = options.concurrency;

		try {
			await documentService.emailDocsAsync(concurrency);
		} catch (error) {
			console.error(`Failed to email documents: ${error}`);
		}
	});

program.parse(process.argv);
