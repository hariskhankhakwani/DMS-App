export class DocumentCreationDomainError extends Error {
	code: number;
	constructor(message: string) {
		super(message);
		this.name = "DocumentCreationDomainError";
		this.code = 500;
	}
}
