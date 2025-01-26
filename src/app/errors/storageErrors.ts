export class FileUploadError extends Error {
	code: number;
	constructor(message = "Error uploading file") {
		super(message);
		this.name = "FileUploadError";
		this.code = 502;
	}
}

export class FileDownloadError extends Error {
	code: number;
	constructor(message = "Error downloading file") {
		super(message);
		this.name = "FileDownloadError";
		this.code = 502;
	}
}

export class FileDeletionError extends Error {
	code: number;
	constructor(message = "Error deleting file") {
		super(message);
		this.name = "FileDeletionError";
		this.code = 502;
	}
}

export class FileRetrievalError extends Error {
	code: number;
	constructor(message = "Error retrieving file") {
		super(message);
		this.name = "FileRetrievalError";
		this.code = 502;
	}
}
export class UnsupportedFileFormatError extends Error {
	code: number;
	constructor(message = "Unsupported file format") {
		super(message);
		this.name = "UnsupportedFileFormatError";
		this.code = 502;
	}
}
