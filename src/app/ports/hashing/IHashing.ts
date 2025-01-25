import type { Effect } from "effect";
import type {
	HashComparisonError,
	HashGenerationError,
} from "../../errors/hashErrors";

export interface IHashing {
	hash(text: string): Effect.Effect<string, HashGenerationError, never>;
	compare(
		text: string,
		hashedText: string,
	): Effect.Effect<boolean, HashComparisonError, never>;
}
