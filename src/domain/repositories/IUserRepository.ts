import type { Effect, Option } from "effect";
import type {
	UserCreationError,
	UserDeletionError,
	UserRetrievalError,
	UserUpdateRoleError,
} from "../../app/errors/userErrors";
import type { User } from "../aggregate/User";
import type { RoleType } from "../valueObjects/Role";

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

	updateUserRole(
		userId: string,
		role: RoleType,
	): Effect.Effect<number, UserUpdateRoleError, never>;
}
