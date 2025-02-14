import { implement } from "@orpc/server";
import { Router } from "express";
import multer from "multer";
import {
	EmailDocumentsRequest,
	GetAllDocumentsByCreatorIdRequest,
	GetAllDocumentsByTagRequest,
	UpdateDocumentTagsRequest,
	UploadDocumentRequest,
} from "../../../app/dtos/documentDtos";
import container from "../../../infra/di/inversify/inversify.config";
import { documentContract } from "../contracts/documentContract";
import { DocumentController } from "../controllers/documentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

const documentController =
	container.get<DocumentController>(DocumentController);

const pub = implement(documentContract);

export const documentRouter = pub.router({
	getDocuments: pub.getDocuments.handler(async ({ input, context }) => {
		const result = await documentController.getAllDocuments();
		return {
			message: result.message,
			data: result.data,
		};
	}),
});

export default documentRouter;
