import { Expose } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { FileFormat } from "../../infra/storage/fileTypes";
import type { FileObject } from "../../shared/types";

export class UploadDocumentRequest {
	@Expose()
	@IsNotEmpty()
	@IsString()
	name: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	path: string;

	@Expose()
	@IsArray()
	tags: string[];

	@Expose()
	@IsNotEmpty()
	file: FileObject;
	// Express.Multer.File[];
}

export class UpdateDocumentRequest {
	@Expose()
	@IsOptional()
	@IsString()
	title?: string;

	@Expose()
	@IsOptional()
	@IsString()
	content?: string;
}

export class DocumentResponse {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	content: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
