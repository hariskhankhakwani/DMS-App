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
			.then((document) => {
				this.logger.info("Document uploaded successfully");
				res.status(201).json({
					message: "Document uploaded successfully",
					data: document,
				});
			})
			.catch((error: FiberFailure) => {
				this.logger.error("failed to upload document");
				if (error.name.split(" ")[1] === "DocumentAlreadyExistsError") {
					res.status(409).json({ message: error.message });
					return;
				}
				if (error.name.split(" ")[1] === "UnauthorizedUserError") {
					this.logger.error("Unauthorized user error");
					res.status(403).json({ message: error.message });
					return;
				}

				res.status(500).json({ message: error.message });
				return;
			});
	};

	getAllDocuments = async (req: Request, res: Response) => {
		Effect.runPromise(this.documentService.getAllDocuments())
			.then((documents) => {
				this.logger.info("Documents retrieved successfully");
				res.status(200).json({
					message: "Documents retrieved successfully",
					data: documents,
				});
			})
			.catch((error: FiberFailure) => {
				this.logger.error("failed to retrieve documents");
				res.status(404).json({ message: error.message });
				return;
			});
	};

	deleteDocument = async (req: Request, res: Response) => {
		Effect.runPromise(
			this.documentService.deleteDocument(
				req.body,
				req.body.loggedInUserId,
				req.body.loggedInUserRole,
			),
		)
			.then((document) => {
				this.logger.info("Document deleted successfully");
				res.status(200).json({
					message: "Document deleted successfully",
					data: document,
				});
			})
			.catch((error: FiberFailure) => {
				this.logger.error("failed to delete document");
				res.status(500).json({ message: error.message });
				return;
			});
	};

	getAllDocumentsByCreatorId = async (req: Request, res: Response) => {
		Effect.runPromise(
			this.documentService.getAllDocumentsByCreatorId(
				req.body,
				req.body.loggedInUserRole,
			),
		)
			.then((documents) => {
				this.logger.info("Documents retrieved successfully");
				res.status(200).json({
					message: "Documents retrieved successfully",
					data: documents,
				});
			})
			.catch((error: FiberFailure) => {
				this.logger.error("failed to retrieve documents by creator id");
				if (error.name.split(" ")[1] === "DocumentNotFoundError") {
					res.status(404).json({ message: error.message });
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

	updateDocumentTags = async (req: Request, res: Response) => {
		Effect.runPromise(
			this.documentService.updateDocumentTags(
				req.body,
				req.body.loggedInUserRole,
			),
		)
			.then((document) => {
				this.logger.info("Document tags updated successfully");
				res.status(200).json({
					message: "Document tags updated successfully",
					data: document,
				});
			})
			.catch((error: FiberFailure) => {
				this.logger.error("failed to update document tags");
				if (error.name.split(" ")[1] === "DocumentNotFoundError") {
					res.status(404).json({ message: error.message });
					return;
				}
				if (error.name.split(" ")[1] === "DocumentAlreadyHasTagsError") {
					res.status(409).json({ message: error.message });
					return;
				}
				res.status(500).json({ message: error.message });
				return;
			});
	};
}
