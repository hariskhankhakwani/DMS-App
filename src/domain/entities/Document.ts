import { Effect } from "effect";
import { v4 as uuidv4 } from "uuid";
import { DocumentCreationDomainError } from "../errors/documentErrors";

export interface IDocumentItem {
	id: string;
	name: string;
	path: string;
	creatorId: string;
	createdAt: Date;
	updatedAt: Date;
	tags: string[];
}

export class DocumentItem {
	private id: string;
	private name: string;
	private path: string;
	private creatorId: string;
	private createdAt: Date;
	private updatedAt: Date;
	private tags: string[];

	private constructor() {
		this.id = uuidv4();
	}

	public static create(
		name: string,
		path: string,
		creatorId: string,
		tags: string[],
	): Effect.Effect<DocumentItem, DocumentCreationDomainError> {
		return Effect.try({
			try: () => {
				const document = new DocumentItem();

				document.setName(name);
				document.setPath(path);
				document.creatorId = creatorId;
				document.createdAt = new Date();
				document.updatedAt = new Date();
				document.tags = tags;
				return document;
			},
			catch: (error) =>
				new DocumentCreationDomainError(
					`Document creation failed doamin: ${error}`,
				),
		});
	}

	public setName(name: string): void {
		if (!name || name.trim().length === 0) {
			throw new Error("Document name cannot be empty");
		}

		if (name.trim().length < 3) {
			throw new Error("Document name must be at least 3 characters long");
		}

		if (name.length > 255) {
			throw new Error("Document name is too long (maximum 255 characters)");
		}

		const validNameRegex = /^[a-zA-Z0-9\s\-_.()]+$/;
		if (!validNameRegex.test(name)) {
			throw new Error("Document name contains invalid characters");
		}

		this.name = name.trim();
	}

	public setPath(path: string): void {
		if (!path || path.trim().length === 0) {
			throw new Error("Document path cannot be empty");
		}

		this.path = path;
	}

	public getId(): string {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public getPath(): string {
		return this.path;
	}

	public getCreatedAt(): Date {
		return this.createdAt;
	}

	public getUpdatedAt(): Date {
		return this.updatedAt;
	}

	public getCreatorId(): string {
		return this.creatorId;
	}

	public getTags(): string[] {
		return this.tags;
	}

	serialize() {
		return {
			id: this.id,
			name: this.name,
			path: this.path,
			creatorId: this.creatorId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			tags: this.tags,
		};
	}

	public static deserialize(obj: IDocumentItem): DocumentItem {
		const document = new DocumentItem();
		document.id = obj.id;
		document.setName(obj.name);
		document.setPath(obj.path);
		document.creatorId = obj.creatorId;
		document.createdAt = obj.createdAt;
		document.updatedAt = obj.updatedAt;
		document.tags = obj.tags;
		return document;
	}
}
