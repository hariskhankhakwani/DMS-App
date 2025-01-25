import type { Tag } from "./Tag";

export class Metadata {
	private author: string;
	private createdAt: Date;
	private updatedAt: Date;
	private tags: Tag[];

	constructor(author: string) {
		this.author = author;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		this.tags = [];
	}

	public addTag(tag: Tag) {
		this.tags.push(tag);
	}

	public static create(author: string): Metadata {
		Metadata.validate(author);
		const normalizedAuthor = author.trim().replace(/\s+/g, " ");

		return new Metadata(normalizedAuthor);
	}

	private static validate(author: string) {
		if (!author || author.trim().length === 0) {
			throw new Error("Author name cannot be empty");
		}

		if (author.trim().length < 2) {
			throw new Error("Author name must be at least 2 characters long");
		}

		if (author.length > 100) {
			throw new Error("Author name is too long (maximum 100 characters)");
		}

		const validAuthorRegex = /^[a-zA-Z0-9\s\-.']+$/;
		if (!validAuthorRegex.test(author)) {
			throw new Error("Author name contains invalid characters");
		}

		const wordCount = author.trim().split(/\s+/).length;
		if (wordCount > 5) {
			throw new Error("Author name cannot contain more than 5 words");
		}
	}

	getAuthor(): string {
		return this.author;
	}
	getCreatedAt(): Date {
		return this.createdAt;
	}
	getUpdatedAt(): Date {
		return this.updatedAt;
	}
	getTags(): Tag[] {
		return [...this.tags];
	}
}
