import { Router } from "express";
import multer from "multer";
import {
	DeleteDocumentRequest,
	GetAllDocumentsByCreatorIdRequest,
	UpdateDocumentTagsRequest,
	UploadDocumentRequest,
} from "../../app/dtos/documentDtos";
import container from "../../infra/di/inversify/inversify.config";
import { DocumentController } from "../controllers/documentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validationMiddleware } from "../middleware/validationMiddleware";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

const router = Router();
const documentController =
	container.get<DocumentController>(DocumentController);

router.post(
	"/upload",
	upload.single("file"),
	validationMiddleware(UploadDocumentRequest),
	authMiddleware,
	documentController.uploadDocument,
);

router.get("/fetchAll", authMiddleware, documentController.getAllDocuments);

router.delete("/deleteById", authMiddleware, documentController.deleteDocument);

router.post(
	"/fetchAllByCreatorId",
	validationMiddleware(GetAllDocumentsByCreatorIdRequest),
	authMiddleware,
	documentController.getAllDocumentsByCreatorId,
);

router.post(
	"/updateTags",
	validationMiddleware(UpdateDocumentTagsRequest),
	authMiddleware,
	documentController.updateDocumentTags,
);
export default router;
