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
			try: () => this.userModel.save(userModel),
			catch: (error) => {
				this.logger.error(
					`failed to create user ${user.getEmail().getEmail()}: ${error}`,
				);
				return new UserCreationError();
			},
		}).pipe(Effect.map((userModel) => UserMapper.toDomain(userModel)));
	}

	getByEmail(
		email: string,
	): Effect.Effect<Option.Option<User>, UserRetrievalError, never> {
		// const userModel = this.userModel.findOne({ where: { email } });

		// if (userModel) {
		// 	this.logger.info(`user found with ${email}`);
		// 	return Ok(userModel);
		// }
		// this.logger.warn(`user not  found with ${email}`);
		// return Err(new UserNotFoundError());
		// return Effect.succeed(Option.none());
		return Effect.tryPromise({
			try: () => this.userModel.findOne({ where: { email } }),
			catch: (error) => {
				this.logger.error(`failed to find user with ${email}: ${error}`);
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

	deleteUser(
		email: string,
	): Effect.Effect<Option.Option<boolean>, UserDeletionError, never> {
		return Effect.tryPromise({
			try: () => this.userModel.delete(email),
			catch: (error) => {
				this.logger.error(`failed to find user with ${email}: ${error}`);
				return new UserDeletionError();
			},
		}).pipe(
			Effect.map((userModel) =>
				userModel ? Option.some(true) : Option.none(),
			),
		);
	}
}
