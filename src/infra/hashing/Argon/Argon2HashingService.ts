import { hash, verify } from "argon2";
import { Effect } from "effect";
import { inject, injectable } from "inversify";
import { HashComparisonError } from "../../../app/errors/hashErrors";
import { HashGenerationError } from "../../../app/errors/hashErrors";
import type { IHashing } from "../../../app/ports/hashing/IHashing";
import type { ILogger } from "../../../app/ports/logger/ILogger";
import { TYPES } from "../../di/inversify/types";

@injectable()
export class Argon2HashingService implements IHashing {
	private readonly logger: ILogger;

	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		this.logger = logger;
	}
	hash(text: string): Effect.Effect<string, HashGenerationError, never> {
		// this.logger.debug("Starting to hash text");

		// const hashedText = await hash(text);

		// this.logger.debug("Text hashed successfully");
		// return Ok(hashedText);

		return Effect.tryPromise({
			try: () => {
				this.logger.debug("hashing password ");
				return hash(text);
			},
			catch: (error) => {
				this.logger.error(`failed to hash text: ${error}`);
				return new HashGenerationError();
			},
		});
	}

	compare(
		text: string,
		hashedText: string,
	): Effect.Effect<boolean, HashComparisonError, never> {
		// this.logger.debug("Starting to compare text with hash");

		// const isMatch = await verify(hashedText, text);

		// this.logger.info(`Hash comparison completed. Match: ${isMatch}`);
		// return Ok(isMatch);

		return Effect.tryPromise({
			try: () => {
				this.logger.info("comparing password");
				return verify(hashedText, text);
			},
			catch: (error) => {
				this.logger.error(`failed to compare text with hash: ${error}`);
				return new HashComparisonError();
			},
		});
	}
}
