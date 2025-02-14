import { z } from "zod";

// Base Error Schema
const BaseErrorSchema = z.object({
	name: z.string(),
	message: z.string(),
	code: z.number(),
	_tag: z.string().optional(),
});

// User Error Schemas
export const UserCreationErrorSchema = BaseErrorSchema.extend({
	name: z.literal("UserCreationError"),
	_tag: z.literal("UserCreationError"),
	code: z.literal(500),
});

export const UserDeletionErrorSchema = BaseErrorSchema.extend({
	name: z.literal("UserDeletionError"),
	_tag: z.literal("UserDeletionError"),
	code: z.literal(500),
});

export const UserRetrievalErrorSchema = BaseErrorSchema.extend({
	name: z.literal("UserRetrievalError"),
	_tag: z.literal("UserRetrievalError"),
	code: z.literal(500),
});

export const UserNotFoundErrorSchema = BaseErrorSchema.extend({
	name: z.literal("UserNotFoundError"),
	_tag: z.literal("UserNotFoundError"),
	code: z.literal(404),
});

export const UserAlreadyExistsErrorSchema = BaseErrorSchema.extend({
	name: z.literal("UserAlreadyExistsError"),
	_tag: z.literal("UserAlreadyExistsError"),
	code: z.literal(409),
});

export const IncorrectPasswordErrorSchema = BaseErrorSchema.extend({
	name: z.literal("IncorrectPasswordError"),
	_tag: z.literal("IncorrectPasswordError"),
	code: z.literal(400),
});

export const InvalidTokenErrorSchema = BaseErrorSchema.extend({
	name: z.literal("InvalidTokenError"),
	_tag: z.literal("InvalidTokenError"),
	code: z.literal(401),
});

// Document Error Schemas
export const DocumentCreationErrorSchema = BaseErrorSchema.extend({
	name: z.literal("DocumentCreationError"),
	_tag: z.literal("DocumentCreationError"),
	code: z.literal(500),
});

export const DocumentUpdateErrorSchema = BaseErrorSchema.extend({
	name: z.literal("DocumentUpdateError"),
	_tag: z.literal("DocumentUpdateError"),
	code: z.literal(500),
});

export const DocumentNotFoundErrorSchema = BaseErrorSchema.extend({
	name: z.literal("DocumentNotFoundError"),
	_tag: z.literal("DocumentNotFoundError"),
	code: z.literal(404),
});

export const DocumentRetrievalErrorSchema = BaseErrorSchema.extend({
	name: z.literal("DocumentRetrievalError"),
	_tag: z.literal("DocumentRetrievalError"),
	code: z.literal(500),
});

export const DocumentDeletionErrorSchema = BaseErrorSchema.extend({
	name: z.literal("DocumentDeletionError"),
	_tag: z.literal("DocumentDeletionError"),
	code: z.literal(500),
});

// Storage Error Schemas
export const FileUploadErrorSchema = BaseErrorSchema.extend({
	name: z.literal("FileUploadError"),
	code: z.literal(502),
});

export const FileDownloadErrorSchema = BaseErrorSchema.extend({
	name: z.literal("FileDownloadError"),
	code: z.literal(502),
});

export const FileDeletionErrorSchema = BaseErrorSchema.extend({
	name: z.literal("FileDeletionError"),
	code: z.literal(502),
});

// JWT Error Schemas
export const JwtGenerationErrorSchema = BaseErrorSchema.extend({
	name: z.literal("JwtGenerationError"),
	code: z.literal(502),
});

export const JwtVerificationErrorSchema = BaseErrorSchema.extend({
	name: z.literal("JwtVerificationError"),
	code: z.literal(401),
});

// Hash Error Schemas
export const HashGenerationErrorSchema = BaseErrorSchema.extend({
	name: z.literal("HashGenerationError"),
	code: z.literal(502),
});

export const HashComparisonErrorSchema = BaseErrorSchema.extend({
	name: z.literal("HashComparisonError"),
	code: z.literal(502),
});

// Domain Error Schemas
export const UserCreationDomainErrorSchema = BaseErrorSchema.extend({
	name: z.literal("UserCreationDomainError"),
	code: z.literal(500),
});

export const DocumentCreationDomainErrorSchema = BaseErrorSchema.extend({
	name: z.literal("DocumentCreationDomainError"),
	code: z.literal(500),
});
