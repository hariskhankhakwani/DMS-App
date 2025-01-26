import { join } from "node:path";
import { FileFormat } from "./fileTypes";

export const getFileExtension = (mimeType: string): string | null => {
	switch (mimeType) {
		case "application/pdf":
			return FileFormat.PDF;
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			return FileFormat.DOCX;
		case "text/plain":
			return FileFormat.TXT;
		case "application/json":
			return FileFormat.JSON;
		case "image/jpeg":
			return FileFormat.JPEG;
		case "image/png":
			return FileFormat.PNG;
		default:
			return null;
	}
};

export const createFilePath = (
	fileName: string,
	fileExtension: string,
): string => {
	return join(
		String(process.env.FILE_STORAGE_PATH),
		`${fileName}.${fileExtension}`,
	);
};
