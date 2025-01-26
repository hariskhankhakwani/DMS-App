export class BaseDocumentError extends Error {
	_tag: string;
	code: number;
	constructor(message = "Document application error") {
		super(message);
		this.name = "BaseDocumentError";
	}
}

export class DocumentAlreadyExistsError extends BaseDocumentError {
	_tag = "DocumentAlreadyExistsError";
	constructor(message = "Document already exists with this name ") {
		super(message);
		this.name = "DocumentAlreadyExistsError";
		this.code = 400;
	}
}

export class DocumentCreationError extends BaseDocumentError {
	_tag = "DocumentCreationError";
	constructor(message = "Document could not be Created") {
		super(message);
		this.name = "DocumentCreationError";
		this.code = 500;
	}
}

export class DocumentUpdateError extends BaseDocumentError {
	_tag = "DocumentUpdateError";
	constructor(message = "Document could not be Updated") {
		super(message);
		this.name = "DocumentUpdateError";
		this.code = 500;
	}
}

export class DocumentRetrievalError extends BaseDocumentError {
	_tag = "DocumentRetrievalError";
	constructor(message = "Document could not be Retrieved") {
		super(message);
		this.name = "DocumentRetrievalError";
		this.code = 500;
	}
}

export class DocumentDeletionError extends BaseDocumentError {
	_tag = "DocumentDeletionError";
	constructor(message = "Document could not be Deleted") {
		super(message);
		this.name = "DocumentDeletionError";
		this.code = 500;
	}
}
