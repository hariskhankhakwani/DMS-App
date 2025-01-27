export class UserCreationDomainError extends Error {
	code: number;
	constructor(message: string) {
		super(message);
		this.name = "UserCreationDomainError";
		this.code = 500;
	}
}
