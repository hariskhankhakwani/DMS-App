import { Effect, Option } from "effect";
import { inject } from "inversify";
import type { Repository } from "typeorm";
import {
	DocumentCreationError,
	DocumentDeletionError,
	DocumentRetrievalError,
	DocumentUpdateError,
} from "../../../../app/errors/docErrors";
import type { ILogger } from "../../../../app/ports/logger/ILogger";
import type { DocumentItem } from "../../../../domain/entities/Document";
import type { IDocumentRepository } from "../../../../domain/repositories/IDocumentRespository";
import { TYPES } from "../../../di/inversify/types";
import { AppDataSource } from "../dataSource";
import { DocumentMapper } from "../mapper/documentMapper";
import { DocumentModel } from "../model/documentModel";

export class typeOrmDocRepository implements IDocumentRepository {
	docModel: Repository<DocumentModel>;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.docModel = AppDataSource.getRepository(DocumentModel);
		this.logger = logger;
	}

	create(
		document: DocumentItem,
	): Effect.Effect<DocumentItem, DocumentCreationError> {
		const docModel = DocumentMapper.toModel(document);
		return Effect.tryPromise({
			try: () => {
				this.logger.info(`Attempting to create document: ${document.name}`);
				const savedDoc = this.docModel.save(docModel);
				this.logger.info("Document created successfully");
				return savedDoc;
			},
			catch: (error) => {
				this.logger.error("failed to create document");
				return new DocumentCreationError();
			},
		}).pipe(Effect.map((docModel) => DocumentMapper.toDomain(docModel)));
	}

	getById(
		id: string,
	): Effect.Effect<Option.Option<DocumentItem>, DocumentRetrievalError> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info(`Attempting to retrieve document with id: ${id}`);
				const doc = this.docModel.findOne({ where: { id } });
				return doc;
			},
			catch: (error) => {
				this.logger.error(`failed to find document with ${name}`);
				return new DocumentRetrievalError();
			},
		}).pipe(
			Effect.map((docModel) =>
				docModel
					? Option.some(DocumentMapper.toDomain(docModel))
					: Option.none(),
			),
		);
	}

	getByName(
		name: string,
	): Effect.Effect<Option.Option<DocumentItem>, DocumentRetrievalError> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info(`Attempting to retrieve document with name: ${name}`);
				const doc = this.docModel.findOne({ where: { name } });
				return doc;
			},
			catch: (error) => {
				this.logger.error(`failed to find document with ${name}`);
				return new DocumentRetrievalError();
			},
		}).pipe(
			Effect.map((docModel) =>
				docModel
					? Option.some(DocumentMapper.toDomain(docModel))
					: Option.none(),
			),
		);
	}

	getAll(): Effect.Effect<DocumentItem[], DocumentRetrievalError> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info("Attempting to retrieve all documents");
				const docs = this.docModel.find();
				return docs;
			},
			catch: (error) => {
				this.logger.error("failed to retrieve all documents");
				return new DocumentRetrievalError();
			},
		}).pipe(Effect.map((docModels) => DocumentMapper.toDomainMany(docModels)));
	}

	getAllByCreatorId(
		creatorId: string,
	): Effect.Effect<DocumentItem[], DocumentRetrievalError> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info(
					`Attempting to retrieve all documents by creator id: ${creatorId}`,
				);
				const docs = this.docModel.find({ where: { creatorId } });
				return docs;
			},
			catch: (error) => {
				this.logger.error(
					`failed to retrieve all documents by creator id: ${creatorId}`,
				);
				return new DocumentRetrievalError();
			},
		}).pipe(Effect.map((docModels) => DocumentMapper.toDomainMany(docModels)));
	}

	deleteById(
		id: string,
	): Effect.Effect<Option.Option<boolean>, DocumentDeletionError> {
		return Effect.tryPromise({
			try: () => {
				const result = this.docModel.delete(id);
				return result;
			},
			catch: (error) => {
				this.logger.error("failed to delete document");
				return new DocumentDeletionError();
			},
		}).pipe(
			Effect.map((docModel) => (docModel ? Option.some(true) : Option.none())),
		);
	}

	updateDocumentCreatorId(
		oldId: string,
		newId: string,
	): Effect.Effect<number, DocumentUpdateError> {
		return Effect.tryPromise({
			try: () => {
				const result = this.docModel.update(
					{ creatorId: oldId },
					{ creatorId: newId },
				);
				return result;
			},
			catch: (error) => {
				this.logger.error("failed to update document creator id");
				return new DocumentUpdateError();
			},
		}).pipe(Effect.map((result) => result.affected ?? -1));
	}

	updateDocumentTags(
		documentId: string,
		tags: string[],
	): Effect.Effect<number, DocumentUpdateError> {
		return Effect.tryPromise({
			try: () => {
				const result = this.docModel.update({ id: documentId }, { tags: tags });
				return result;
			},
			catch: (error) => {
				this.logger.error("failed to update document tags");
				return new DocumentUpdateError();
			},
		}).pipe(Effect.map((result) => result.affected ?? -1));
	}

	getByTag(tag: string): Effect.Effect<DocumentItem[], DocumentRetrievalError> {
		return Effect.tryPromise({
			try: () => {
				const docs = this.docModel
					.createQueryBuilder("document")
					.where(":searchTerm = ANY(document.tags)", { searchTerm: tag })
					.getMany();
				return docs;
			},
			catch: (error) => {
				this.logger.error("failed to retrieve documents by tag");
				return new DocumentRetrievalError();
			},
		}).pipe(Effect.map((docModels) => DocumentMapper.toDomainMany(docModels)));
	}
}
