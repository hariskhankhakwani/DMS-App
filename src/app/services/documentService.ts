import { inject } from "inversify";

import { Effect, Option, pipe } from "effect";
import { effectContext } from "effect/Layer";
import { injectable } from "inversify";
import { DocumentItem } from "../../domain/entities/Document";
import type { IDocumentRepository } from "../../domain/repositories/IDocumentRespository";
import { RoleType } from "../../domain/valueObjects/Role";
import { TYPES } from "../../infra/di/inversify/types";
import type { UploadDocumentRequest } from "../dtos/documentDtos";
import {
	DocumentAlreadyExistsError,
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
}
