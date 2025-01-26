import type { Effect } from "effect";
import type { FileObject } from "../../../shared/types";
import type { FileUploadError } from "../../errors/storageErrors";
export interface IStorage {
	uploadFile(
		file: FileObject,
		fileName: string,
	): Effect.Effect<string, FileUploadError>;
	// getFile(filePath: string): Effect.Effect<Buffer, FileRetrievalError>;
	// downloadFile(
	// 	filePath: string,
	// 	downloadFolder: string,
	// ): Effect.Effect<string, FileDownloadError>;
	// deleteFile(filePath: string): Effect.Effect<boolean, FileDeletionError>;
}
