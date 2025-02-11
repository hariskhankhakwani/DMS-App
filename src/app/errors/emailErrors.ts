export class EmailSendingError extends Error {
	code: number;
	constructor(message = "Failed to send email") {
		super(message);
		this.name = "EmailSendingError";
		this.code = 502;
	}
}
