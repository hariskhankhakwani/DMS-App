import type { Effect } from "effect";
import type { JwtPayload } from "../../../shared/types";
import type { JWTAccessTokenPayload } from "../../dtos/userDtos";
import type { JwtGenerationError } from "../../errors/jwtError";
import type { JwtVerificationError } from "../../errors/jwtError";

export interface IJwt {
	generate(
		payload: JWTAccessTokenPayload,
	): Effect.Effect<string, JwtGenerationError, never>;
	verify(
		token: string,
	): Effect.Effect<string | JwtPayload, JwtVerificationError, never>;
	// decode(
	// 	token: string,
	// ): Promise<
	// 	Result<{ header: any; payload: unknown; signature: any }, JwtError>
	// >;
}
