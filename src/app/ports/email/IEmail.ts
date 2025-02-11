import type { Effect } from "effect";
import type { SendEmailParams } from "../../../shared/types";
import type { EmailSendingError } from "../../errors/emailErrors";
export interface IEmail {
	// sendEmail(
	// 	emailParams: SendEmailParams[],
	// 	mode?: string,
	// ): Effect.Effect<boolean[], EmailSendingError, never>;
	simulateEmail(
		params: SendEmailParams,
	): Effect.Effect<boolean, EmailSendingError, never>;
}
