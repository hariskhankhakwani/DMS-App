import { inject } from "inversify";

import { Effect, Option } from "effect";
import { injectable } from "inversify";
import { DocumentItem } from "../../domain/entities/Document";
import type { IDocumentRepository } from "../../domain/repositories/IDocumentRespository";
import { RoleType } from "../../domain/valueObjects/Role";
import { TYPES } from "../../infra/di/inversify/types";
import type { UploadDocumentRequest } from "../dtos/documentDtos";
import { DocumentAlreadyExistsError } from "../errors/docErrors";
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

		return this.documentRepository.getByName(documentUploadDto.name).pipe(
			Effect.flatMap((documentOption) =>
				Option.isSome(documentOption)
					? Effect.fail(new DocumentAlreadyExistsError())
					: this.storage
							.uploadFile(documentUploadDto.file, documentUploadDto.name)
							.pipe(
								Effect.flatMap((filePath) =>
									Effect.try(() =>
										DocumentItem.create(
											documentUploadDto.name,
											filePath,
											loggedInUserId,
											documentUploadDto.tags,
										),
									)
										.pipe(
											Effect.flatMap((new_document) =>
												this.documentRepository.create(new_document),
											),
										)
										.pipe(Effect.map((document) => document.serialize())),
								),
							),
			),
		);
	}
}
