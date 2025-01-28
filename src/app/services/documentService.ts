import { inject } from "inversify";

import { Effect, Option, pipe } from "effect";
import { effectContext } from "effect/Layer";
import { injectable } from "inversify";
import { DocumentItem } from "../../domain/entities/Document";
import type { IDocumentRepository } from "../../domain/repositories/IDocumentRespository";
import { RoleType } from "../../domain/valueObjects/Role";
import { TYPES } from "../../infra/di/inversify/types";
import type {
	DeleteDocumentRequest,
	GetAllDocumentsByCreatorIdRequest,
	UploadDocumentRequest,
} from "../dtos/documentDtos";
import {
	DocumentAlreadyExistsError,
	DocumentDeletionError,
	DocumentNotFoundError,
} from "../errors/docErrors";
import { UnauthorizedUserError } from "../errors/userErrors";
import type { ILogger } from "../ports/logger/ILogger";
import type { IStorage } from "../ports/storage/IStorage";

@injectable()
export class DocumentService {
	private documentRepository: IDocumentRepository;
	private logger: ILogger;
	private storage: IStorage;
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IDocumentItemRepository)
		documentRepository: IDocumentRepository,
		@inject(TYPES.IStorage) storage: IStorage,
	) {
		this.documentRepository = documentRepository;
		this.logger = logger;
		this.storage = storage;
	}

	uploadDocument(
		documentUploadDto: UploadDocumentRequest,
		loggedInUserId: string,
		loggedInUserRole: string,
	) {
		if (loggedInUserRole !== RoleType.ADMIN) {
			return Effect.fail(new UnauthorizedUserError());
		}

		const documentOption = this.documentRepository.getByName(
			documentUploadDto.name,
		);

		const documentError = documentOption.pipe(
			Effect.flatMap((document) =>
				Option.match(document, {
					onSome: () => {
						this.logger.info("Document already exists");
						return Effect.fail(new DocumentAlreadyExistsError());
					},
					onNone: () => {
						this.logger.info("Document not found");
						return Effect.succeed(new DocumentNotFoundError());
					},
				}),
			),
		);

		const documentCreation = pipe(
			Effect.all([documentError]),
			Effect.andThen(([document]) => {
				return this.storage.uploadFile(
					documentUploadDto.file,
					documentUploadDto.name,
				);
			}),
			Effect.flatMap((filePath) => {
				const doc = DocumentItem.create(
					documentUploadDto.name,
					filePath,
					loggedInUserId,
					documentUploadDto.tags,
				);
				return doc;
			}),
			Effect.flatMap((doc) => {
				return this.documentRepository.create(doc);
			}),
			Effect.map((doc) => doc.serialize()),
		);

		return documentCreation;
	}

	// ... existing code ...

	deleteDocument(
		deleteDocumentRequest: DeleteDocumentRequest,
		loggedInUserId: string,
		loggedInUserRole: string,
	) {
		if (loggedInUserRole !== RoleType.ADMIN) {
			return Effect.fail(new UnauthorizedUserError());
		}

		const documentOption = this.documentRepository.getById(
			deleteDocumentRequest.documentId,
		);

		const document = documentOption.pipe(
			Effect.flatMap((document) =>
				Option.match(document, {
					onSome: (doc) => {
						this.logger.info("Document found, proceeding to delete");
						return Effect.succeed(doc);
					},
					onNone: () => {
						this.logger.info("Document not found");
						return Effect.fail(new DocumentNotFoundError());
					},
				}),
			),
		);

		const documentDeletion = pipe(
			Effect.all([document]),
			Effect.andThen(([doc]) => {
				return this.storage.deleteFile(doc.getPath());
			}),
			Effect.andThen(() => {
				return this.documentRepository.deleteById(
					deleteDocumentRequest.documentId,
				);
			}),
			Effect.map((isDeleted) => {
				Option.match(isDeleted, {
					onSome: () => {
						this.logger.info("Document successfully deleted");
						return Effect.succeed({ success: true });
					},
					onNone: () => {
						this.logger.info("Document not found");
						return Effect.fail(
							new DocumentDeletionError("document not deleted from database"),
						);
					},
				});
			}),
		);

		return documentDeletion;
	}

	getAllDocuments() {
		const documents = this.documentRepository.getAll();

		const documentsRetrieval = documents.pipe(
			Effect.flatMap((documents) => {
				if (documents.length === 0) {
					this.logger.info("No documents found");
					return Effect.fail(new DocumentNotFoundError());
				}
				this.logger.info("Documents retrieved successfully");
				return Effect.succeed(documents.map((doc) => doc.serialize()));
			}),
		);

		return documentsRetrieval;
	}

	getAllDocumentsByCreatorId(
		getAllDocumentsByCreatorIdRequest: GetAllDocumentsByCreatorIdRequest,
		loggedInUserRole: string,
	) {
		if (loggedInUserRole !== RoleType.ADMIN) {
			this.logger.info("User is not an admin");
			return Effect.fail(new UnauthorizedUserError());
		}

		this.logger.info("User is an admin");

		this.logger.info("Getting all documents by creator id");
		const documents = this.documentRepository.getAllByCreatorId(
			getAllDocumentsByCreatorIdRequest.creatorId,
		);

		const documentsRetrieval = documents.pipe(
			Effect.flatMap((documents) => {
				if (documents.length === 0) {
					this.logger.info("No documents found");
					return Effect.fail(new DocumentNotFoundError());
				}
				this.logger.info("Documents retrieved successfully");
				return Effect.succeed(documents.map((doc) => doc.serialize()));
			}),
		);

		return documentsRetrieval;
	}
}
