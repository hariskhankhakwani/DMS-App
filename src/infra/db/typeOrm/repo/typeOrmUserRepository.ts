import { Effect, Option } from "effect";
import { inject, injectable } from "inversify";
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm";
import {
	UserCreationError,
	UserDeletionError,
	UserNotFoundError,
	UserRetrievalError,
} from "../../../../app/errors/userErrors";
import type { ILogger } from "../../../../app/ports/logger/ILogger";
// biome-ignore lint/style/useImportType: <explanation>
import { User } from "../../../../domain/aggregate/User";
import type { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { TYPES } from "../../../di/inversify/types";
import { AppDataSource } from "../dataSource";
import { UserMapper } from "../mapper/userMapper";
import { UserModel } from "../model/userModel";
@injectable()
export class typeOrmUserRepository implements IUserRepository {
	userModel: Repository<UserModel>;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.userModel = AppDataSource.getRepository(UserModel);
		this.logger = logger;
	}

	createUser(user: User): Effect.Effect<User, UserCreationError, never> {
		// try {
		// 	const userModel = UserMapper.toModel(user);
		// 	 this.userModel.save(userModel);

		// 	this.logger.info(`created user ${user.getEmail().getEmail()}`);
		// 	return Ok(UserMapper.toDomain(userModel));
		// } catch (error) {
		// 	this.logger.error(
		// 		`failed to create user ${user.getEmail().getEmail()}: ${error}`,
		// 	);
		// 	return Err(error as Error);
		// }
		const userModel = UserMapper.toModel(user);
		return Effect.tryPromise({
			try: () => {
				const savedUser = this.userModel.save(userModel);
				this.logger.info("User created successfully");
				return savedUser;
			},
			catch: (error) => {
				this.logger.error("failed to create user");
				return new UserCreationError();
			},
		}).pipe(Effect.map((userModel) => UserMapper.toDomain(userModel)));
	}

	getByEmail(
		email: string,
	): Effect.Effect<Option.Option<User>, UserRetrievalError, never> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info(`Attempting to retrieve user with email: ${email}`);
				const user = this.userModel.findOne({ where: { email } });
				return user;
			},
			catch: (error) => {
				this.logger.error("failed  find by email ");
				return new UserRetrievalError();
			},
		}).pipe(
			Effect.map(
				(userModel) =>
					userModel
						? Option.some(UserMapper.toDomain(userModel))
						: Option.none(),
				// userModel ? UserMapper.toDomain(userModel) : undefined,
			),
		);
	}

	getById(
		id: string,
	): Effect.Effect<Option.Option<User>, UserRetrievalError, never> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info(`Attempting to retrieve user with id: ${id}`);
				const user = this.userModel.findOne({ where: { id } });
				return user;
			},
			catch: (error) => {
				this.logger.error("failed  find by id ");
				return new UserRetrievalError();
			},
		}).pipe(
			Effect.map((userModel) =>
				userModel ? Option.some(UserMapper.toDomain(userModel)) : Option.none(),
			),
		);
	}

	deleteUser(
		id: string,
	): Effect.Effect<Option.Option<boolean>, UserDeletionError, never> {
		return Effect.tryPromise({
			try: () => {
				this.logger.info(`Attempting to delete user with id: ${id}`);
				const result = this.userModel.delete(id);
				return result;
			},
			catch: (error) => {
				this.logger.error(`failed to delete user with ${id}`);
				return new UserDeletionError();
			},
		}).pipe(
			Effect.map((userModel) =>
				userModel.affected ? Option.some(true) : Option.none(),
			),
		);
	}

	getAllUsers(): Effect.Effect<User[], UserRetrievalError, never> {
		return Effect.tryPromise({
			try: () => {
				const users = this.userModel.find();
				return users;
			},
			catch: (error) => {
				this.logger.error("failed to retrieve all users");
				return new UserRetrievalError();
			},
		}).pipe(Effect.map((userModels) => UserMapper.toDomainMany(userModels)));
	}
}
