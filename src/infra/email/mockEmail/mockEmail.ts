// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { promises as fs } from "fs";
import { Effect } from "effect";
import { inject, injectable } from "inversify";
import { EmailSendingError } from "../../../app/errors/emailErrors";
import type { IEmail } from "../../../app/ports/email/IEmail";
import type { ILogger } from "../../../app/ports/logger/ILogger";
import type { SendEmailParams } from "../../../shared/types";
import { TYPES } from "../../di/inversify/types";

@injectable()
export class MockEmail implements IEmail {
	private readonly logger: ILogger;
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		this.logger = logger;
	}

	simulateEmail(
		params: SendEmailParams,
	): Effect.Effect<boolean, EmailSendingError, never> {
		return Effect.try({
			try: () => {
				// this.logger.info(`Sending email to ${params.to}`);
				// const filePath = `${process.env.EMAIL_STORAGE_PATH}/${params.to}/${params.body.filename}`;
				// const writeFile = fs.writeFile(
				// 	filePath,
				// 	new Uint8Array(params.body.attachment),
				// );
				this.logger.info(`Mock Email sucessfully sent to ${params.to}`);
				return true;
			},
			catch: (error) => {
				this.logger.error(`Failed to send email to ${params.to}`);
				return new EmailSendingError();
			},
		}).pipe(Effect.as(true));
	}

	// sendEmail(emailParams: SendEmailParams[], mode = "seq") {
	// 	// if (mode === "parallel") {
	// 	// 	return Effect.forEach(emailParams, this._simulateEmail, {
	// 	// 		concurrency: "unbounded",
	// 	// 	});
	// 	// }
	// 	// if (mode === "concurrent") {
	// 	// 	return Effect.forEach(emailParams, this._simulateEmail, {
	// 	// 		concurrency: Number(process.env.EMAIL_CONCURRENCY),
	// 	// 	});
	// 	// }
	// 	return Effect.forEach(emailParams, this._simulateEmail);
	// }
}
