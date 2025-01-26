import { Effect } from "effect";
import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { ILogger } from "../../app/ports/logger/ILogger";
import type { DocumentService } from "../../app/services/documentService";
import { TYPES } from "../../infra/di/inversify/types";

@injectable()
export class DocumentController {
	constructor(
		@inject(TYPES.DocumentService) private documentService: DocumentService,
		@inject(TYPES.ILogger) private logger: ILogger,
	) {}

	uploadDocument = async (req: Request, res: Response) => {
		req.body.file = req.file;
		if (!req.body.file) {
			res.status(400).json({ message: "No file uploaded" });
			return;
		}
		Effect.runPromise(
			this.documentService.uploadDocument(
				req.body,
				req.body.loggedInUserId,
				req.body.loggedInUserRole,
			),
		)
			.then((document) =>
				res.status(201).json({
					message: "Document uploaded successfully",
					data: document,
				}),
			)
			.catch((error) => {
				res.status(error.code).json({ message: error.message });
				return;
			});
	};
}
