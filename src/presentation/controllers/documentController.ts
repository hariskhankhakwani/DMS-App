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
		const response = this.documentService.uploadDocument(
			req.body,
			req.body.loggedInUserId,
			req.body.loggedInUserRole,
		);
		const responseMatch = Effect.match(response, {
			onSuccess: (document) => {
				this.logger.info("Document uploaded successfully");
				return {
					code: 201,
					message: "Document uploaded successfully",
					data: document,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to upload document");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	getAllDocuments = async (req: Request, res: Response) => {
		const response = this.documentService.getAllDocuments();
		const responseMatch = Effect.match(response, {
			onSuccess: (documents) => {
				this.logger.info("Documents retrieved successfully");
				return {
					code: 200,
					message: "Documents retrieved successfully",
					data: documents,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to retrieve documents");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	deleteDocument = async (req: Request, res: Response) => {
		const response = this.documentService.deleteDocument(
			req.body,
			req.body.loggedInUserId,
			req.body.loggedInUserRole,
		);
		const responseMatch = Effect.match(response, {
			onSuccess: (document) => {
				this.logger.info("Document deleted successfully");
				return {
					code: 200,
					message: "Document deleted successfully",
					data: document,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to delete document");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	getAllDocumentsByCreatorId = async (req: Request, res: Response) => {
		const response = this.documentService.getAllDocumentsByCreatorId(
			req.body,
			req.body.loggedInUserRole,
		);
		const responseMatch = Effect.match(response, {
			onSuccess: (documents) => {
				this.logger.info("Documents retrieved successfully");
				return {
					code: 200,
					message: "Documents retrieved successfully",
					data: documents,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to retrieve documents by creator id");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	updateDocumentTags = async (req: Request, res: Response) => {
		const response = this.documentService.updateDocumentTags(
			req.body,
			req.body.loggedInUserRole,
		);
		const responseMatch = Effect.match(response, {
			onSuccess: (document) => {
				this.logger.info("Document tags updated successfully");
				return {
					code: 200,
					message: "Document tags updated successfully",
					data: document,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to update document tags");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	getAllDocumentsByTag = async (req: Request, res: Response) => {
		const response = this.documentService.getAllDocumentsByTag(req.body);
		const responseMatch = Effect.match(response, {
			onSuccess: (documents) => {
				this.logger.info("Documents retrieved successfully by tag");
				return {
					code: 200,
					message: "Documents retrieved successfully by tag",
					data: documents,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to retrieve documents by tag");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};
}
