import type { Effect, Option } from "effect";
import type {
	UserCreationError,
	UserDeletionError,
	UserRetrievalError,
} from "../../app/errors/userErrors";
import type { User } from "../aggregate/User";

export interface IUserRepository {
	// getAllUsers(): Effect.Effect<User[], UserRetrievalError, never>;
	createUser(user: User): Effect.Effect<User, UserCreationError, never>;
	deleteUser(
		id: string,
	): Effect.Effect<Option.Option<boolean>, UserDeletionError, never>;
	getByEmail(
		email: string,
	): Effect.Effect<Option.Option<User>, UserRetrievalError, never>;
	getById(
		id: string,
	): Effect.Effect<Option.Option<User>, UserRetrievalError, never>;

	getAllUsers(): Effect.Effect<User[], UserRetrievalError, never>;
}
