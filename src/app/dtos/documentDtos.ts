import { Expose } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";
import type { Concurrency } from "effect/Types";
import { FileFormat } from "../../infra/storage/fileTypes";
import type { FileObject } from "../../shared/types";

export class UploadDocumentRequest {
	@Expose()
	@IsNotEmpty()
	@IsString()
	name: string;

	@Expose()
	@IsArray()
	tags: string[];

	@Expose()
	file: FileObject;
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

export class DeleteDocumentRequest {
	@Expose()
	@IsNotEmpty()
	@IsString()
	documentId: string;
}

export class GetAllDocumentsByCreatorIdRequest {
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	creatorId: string;
}

export class UpdateDocumentTagsRequest {
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	documentId: string;

	@Expose()
	@IsNotEmpty()
	@IsArray()
	tags: string[];
}

export class GetAllDocumentsByTagRequest {
	@Expose()
	@IsNotEmpty()
	@IsString()
	tag: string;
}

export class EmailDocumentsRequest {
	@Expose()
	@IsNotEmpty()
	concurrency: Concurrency;
}
