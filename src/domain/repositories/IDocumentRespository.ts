import type { Effect, Option } from "effect";
import type {
	DocumentDeletionError,
	DocumentRetrievalError,
	DocumentUpdateError,
} from "../../app/errors/docErrors";
import type { DocumentCreationError } from "../../app/errors/docErrors";
import type { DocumentItem } from "../entities/Document";

export interface IDocumentRepository {
	create(
		document: DocumentItem,
	): Effect.Effect<DocumentItem, DocumentCreationError>;
	getByName(
		name: string,
	): Effect.Effect<Option.Option<DocumentItem>, DocumentRetrievalError>;

	getById(
		id: string,
	): Effect.Effect<Option.Option<DocumentItem>, DocumentRetrievalError>;
	// update(
	// 	document: DocumentItem,
	// ): Effect.Effect<DocumentItem, DocumentUpdateError>;
	// get(id: string): Effect.Effect<DocumentItem, DocumentRetrievalError>;
	getAll(): Effect.Effect<DocumentItem[], DocumentRetrievalError>;
	deleteById(
		id: string,
	): Effect.Effect<Option.Option<boolean>, DocumentDeletionError>;

	getAllByCreatorId(
		creatorId: string,
	): Effect.Effect<DocumentItem[], DocumentRetrievalError>;
	// search(
	// 	metadata: Partial<Metadata>,
	// ): Effect.Effect<DocumentItem[], DocumentRetrievalError>;

	updateDocumentCreatorId(
		oldId: string,
		newId: string,
	): Effect.Effect<number, DocumentUpdateError>;
}
