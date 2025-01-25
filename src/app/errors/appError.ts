export class InternalServerError extends Error {
	code: number;
	constructor(message = "Internal Server Error") {
		super(message);
		this.name = "InternalServerError";
		this.code = 500;
	}
}
