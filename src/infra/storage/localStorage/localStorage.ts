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
				await fs.writeFile(filePath, file.buffer);
				return filePath;
			},
			catch: (error) => {
				this.logger.error(`failed to upload file : ${error}`);
				return new FileUploadError();
			},
		});
	}

	// getFile(filePath: string): Effect.Effect<Buffer, FileRetrievalError> {
	// 	return Effect.tryPromise({
	// 		try: () => {
	// 			const file = fs.readFile(filePath);
	// 			this.logger.info(`File retrieved successfully: ${filePath}`);
	// 			return file;
	// 		},
	// 		catch: (error) => {
	// 			this.logger.error(`failed to retrieve file: ${error}`);
	// 			return new FileRetrievalError();
	// 		},
	// 	});
	// }

	// downloadFile(
	// 	filePath: string,
	// 	downloadFolder: string,
	// ): Effect.Effect<string, FileDownloadError> {
	// 	const fileName = filePath.split("/").pop();
	// 	if (!fileName) {
	// 		this.logger.error(`Invalid file path: ${filePath}`);
	// 		return Effect.fail(new FileDownloadError("Invalid file path"));
	// 	}

	// 	const destinationPath = join(downloadFolder, fileName);
	// 	return Effect.tryPromise({
	// 		try: async (signal: AbortSignal) => {
	// 			await fs.copyFile(filePath, destinationPath);
	// 			this.logger.info(`File downloaded successfully to: ${destinationPath}`);
	// 		},
	// 		catch: (error) => {
	// 			this.logger.error(`failed to download file: ${error}`);
	// 			return new FileDownloadError();
	// 		},
	// 	}).pipe(Effect.map(() => destinationPath));
	// }

	// deleteFile(filePath: string): Effect.Effect<boolean, FileDeletionError> {
	// 	return Effect.tryPromise({
	// 		try: async (signal: AbortSignal) => {
	// 			await fs.unlink(filePath);
	// 			this.logger.info(`File deleted successfully: ${filePath}`);
	// 			return true;
	// 		},
	// 		catch: (error) => {
	// 			this.logger.error(`failed to delete file: ${error}`);
	// 			return new FileDeletionError();
	// 		},
	// 	});
	// }
}
