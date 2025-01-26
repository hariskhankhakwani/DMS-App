import { Effect } from "effect";
import { inject, injectable } from "inversify";
import { sign, verify } from "jsonwebtoken";
import type { JWTAccessTokenPayload } from "../../app/dtos/userDtos";
import { JwtGenerationError } from "../../app/errors/jwtError";
import { JwtVerificationError } from "../../app/errors/jwtError";
import type { IJwt } from "../../app/ports/jwt/IJwt";
import type { ILogger } from "../../app/ports/logger/ILogger";
import type { JwtPayload } from "../../shared/types";
import { TYPES } from "../di/inversify/types";

@injectable()
export class JsonWebTokenJwt implements IJwt {
	private readonly secretKey: string;

	constructor(@inject(TYPES.ILogger) private readonly logger: ILogger) {
		this.secretKey = process.env.secret as string;
	}

	generate(
		payload: JWTAccessTokenPayload,
	): Effect.Effect<string, JwtGenerationError, never> {
		// this.logger.debug("Starting to generate JWT token ");
		// const token = sign({ data: payload }, this.secretKey);
		// this.logger.debug("JWT token generated successfully");
		// return Ok(token);

		return Effect.try({
			try: () => sign({ data: payload }, this.secretKey),
			catch: (error) => {
				this.logger.error(`failed to generate JWT token: ${error}`);
				return new JwtGenerationError();
			},
		});
	}

	verify(
		token: string,
	): Effect.Effect<string | JwtPayload, JwtVerificationError, never> {
		// this.logger.debug("Starting to verify JWT token");
		// verify(token, this.secretKey);
		// this.logger.debug("JWT token verified successfully");
		// return Ok(true);

		return Effect.try({
			try: () => verify(token, this.secretKey),
			catch: (error) => {
				this.logger.error(`failed to verify JWT token: ${error}`);
				return new JwtVerificationError();
			},
		});
	}

	// async decode(
	// 	token: string,
	// ): Promise<
	// 	Result<{ header: any; payload: unknown; signature: any }, JwtError>
	// > {
	// 	const decoded = decode(token, { complete: true });

	// 	if (!decoded) {
	// 		return Err(new JwtError());
	// 	}

	// 	this.logger.debug("JWT token decoded successfully");

	// 	return Ok({
	// 		header: decoded.header,
	// 		payload: decoded.payload,
	// 		signature: decoded.signature,
	// 	});
	// }
}
