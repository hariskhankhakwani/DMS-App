import { Effect } from "effect";
import type { FiberFailure } from "effect/Runtime";
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
			.catch((error: FiberFailure) => {
				if (error.name.split(" ")[1] === "DocumentAlreadyExistsError") {
					res.status(409).json({ message: error.message });
					return;
				}
				if (error.name.split(" ")[1] === "UnauthorizedUserError") {
					res.status(403).json({ message: error.message });
					return;
				}

				res.status(500).json({ message: error.message });
				return;
			});
	};
}
