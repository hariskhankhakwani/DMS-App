import { z } from "zod";

export const DocumentSchema = z.object({
	id: z.string(),
	name: z.string(),
	path: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	creatorId: z.string(),
	tags: z.array(z.string()),
});

export const CreateDocumentSchema = DocumentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export const UpdateDocumentSchema = DocumentSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const DeleteDocumentSchema = z.object({
	documentId: z.string(),
});

export const GetAllDocumentsByCreatorIdSchema = z.object({
	creatorId: z.string(),
});

export const UpdateDocumentTagsSchema = z.object({
	documentId: z.string(),
	tags: z.array(z.string()),
});

export const GetAllDocumentsByTagSchema = z.object({
	tag: z.string(),
});

export const UploadDocumentSchema = z.object({
	name: z.string().nonempty(),
	tags: z.array(z.string()),
	file: z.object({
		fieldname: z.string(),
		originalname: z.string(),
		encoding: z.string(),
		mimetype: z.string(),
		buffer: z.instanceof(Buffer),
		size: z.number(),
	}),
});
