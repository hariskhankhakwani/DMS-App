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
	// update(
	// 	document: DocumentItem,
	// ): Effect.Effect<DocumentItem, DocumentUpdateError>;
	// get(id: string): Effect.Effect<DocumentItem, DocumentRetrievalError>;
	// getAll(userId: UUID): Effect.Effect<DocumentItem[], DocumentRetrievalError>;
	// delete(id: string): Effect.Effect<boolean, DocumentDeletionError>;
	// search(
	// 	metadata: Partial<Metadata>,
	// ): Effect.Effect<DocumentItem[], DocumentRetrievalError>;
}
