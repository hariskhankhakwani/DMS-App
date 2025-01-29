// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { promises as fs } from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from "path";
import { Effect } from "effect";
import { inject, injectable } from "inversify";
import {
	FileDeletionError,
	FileDownloadError,
	FileRetrievalError,
	FileUploadError,
	UnsupportedFileFormatError,
} from "../../../app/errors/storageErrors";
import type { ILogger } from "../../../app/ports/logger/ILogger";
import type { IStorage } from "../../../app/ports/storage/IStorage";
import type { FileObject } from "../../../shared/types";
import { TYPES } from "../../di/inversify/types";
import { createFilePath, getFileExtension } from "../utils";

@injectable()
export class LocalStorage implements IStorage {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	uploadFile(
		file: FileObject,
		fileName: string,
	): Effect.Effect<string, FileUploadError> {
		const fileExtension = getFileExtension(file.mimetype);
		if (!fileExtension) {
			this.logger.error(`Unsupported file format: ${file.mimetype}`);
			return Effect.fail(
				new UnsupportedFileFormatError(
					`Unsupported file format ${file.mimetype}`,
				),
			);
		}

		const filePath = createFilePath(fileName, fileExtension);
		return Effect.tryPromise({
			try: async (signal: AbortSignal) => {
				await fs.writeFile(filePath, new Uint8Array(file.buffer));
				this.logger.info(`File uploaded successfully: ${filePath}`);
				return filePath;
			},
			catch: (error) => {
				this.logger.error(`failed to upload file: ${error}`);
				return new FileUploadError(`failed to upload file: ${error}`);
			},
		});
	}

	deleteFile(filePath: string): Effect.Effect<boolean, FileDeletionError> {
		return Effect.tryPromise({
			try: async (signal: AbortSignal) => {
				await fs.unlink(filePath);
				this.logger.info(`File deleted successfully: ${filePath}`);
				return true;
			},
			catch: (error) => {
				this.logger.error(`failed to delete file: ${error}`);
				return new FileDeletionError(`failed to delete file: ${error}`);
			},
		});
	}
}
