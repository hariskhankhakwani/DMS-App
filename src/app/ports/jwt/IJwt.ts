import type { Effect } from "effect";
import type { JwtGenerationError } from "../../errors/jwtError";
import type { JwtVerificationError } from "../../errors/jwtError";

export interface IJwt {
	generate(payload: unknown): Effect.Effect<string, JwtGenerationError, never>;
	verify(token: string): Effect.Effect<boolean, JwtVerificationError, never>;
	// decode(
	// 	token: string,
	// ): Promise<
	// 	Result<{ header: any; payload: unknown; signature: any }, JwtError>
	// >;
}
