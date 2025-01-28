import { Effect, Option, pipe } from "effect";
import { inject, injectable } from "inversify";
import { User } from "../../domain/aggregate/User";
import type { IDocumentRepository } from "../../domain/repositories/IDocumentRespository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/valueObjects/Email";
import { RoleType } from "../../domain/valueObjects/Role";
import { UserMapper } from "../../infra/db/typeOrm/mapper/userMapper";
import { TYPES } from "../../infra/di/inversify/types";
import type { LoginUserRequest, RegisterUserRequest } from "../dtos/userDtos";
import {
	BaseUserError,
	IncorrectPasswordError,
	InvalidTokenError,
	SelfDeletionError,
	UnauthorizedUserError,
	UserAlreadyExistsError,
	UserDeletionError,
	UserNotFoundError,
} from "../errors/userErrors";
import type { IHashing } from "../ports/hashing/IHashing";
import type { IJwt } from "../ports/jwt/IJwt";
import type { ILogger } from "../ports/logger/ILogger";

@injectable()
export class UserService {
	private userRepository: IUserRepository;
	private hashService: IHashing;
	private jwtService: IJwt;
	private logger: ILogger;
	private docRepository: IDocumentRepository;
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.IDocumentItemRepository)
		docRepository: IDocumentRepository,
		@inject(TYPES.IHashingService) hashingService: IHashing,
		@inject(TYPES.IJwt) jwtService: IJwt,
	) {
		this.userRepository = userRepository;
		this.hashService = hashingService;
		this.logger = logger;
		this.jwtService = jwtService;
		this.docRepository = docRepository;
	}

	registerUser(regUserDto: RegisterUserRequest) {
		const userOption = this.userRepository.getByEmail(
			regUserDto.email.toLowerCase(),
		);

		const hashedPassword = this.hashService.hash(regUserDto.password);

		const userError = userOption.pipe(
			Effect.flatMap((user) =>
				Option.match(user, {
					onSome: (user) => {
						this.logger.info("User already exists");
						return Effect.fail(new UserAlreadyExistsError());
					},
					onNone: () => {
						this.logger.info("User not found");
						return Effect.succeed(new UserNotFoundError());
					},
				}),
			),
		);

		const userCreation = pipe(
			Effect.all([userError, hashedPassword]),
			Effect.andThen(([user, hashedPassword]) => {
				return User.create(
					regUserDto.firstName,
					regUserDto.lastName,
					Email.create(regUserDto.email.toLowerCase()),
					hashedPassword,
				);
			}),
			Effect.flatMap((user) => this.userRepository.createUser(user)),
			Effect.map((user) => user.serialize()),
		);

		return userCreation;
	}

	loginUser(loginUserDto: LoginUserRequest) {
		const userOption = this.userRepository.getByEmail(
			loginUserDto.email.toLowerCase(),
		);

		const user = userOption.pipe(
			Effect.flatMap((user) =>
				Option.match(user, {
					onSome: (user) => {
						this.logger.info("User found");
						return Effect.succeed(user);
					},
					onNone: () => {
						this.logger.info("User not found");
						return Effect.fail(new UserNotFoundError());
					},
				}),
			),
		);
		const isMatch = user.pipe(
			Effect.map((user) => user.getPassword()),
			Effect.flatMap((hashedPassword) => {
				const isMatch = this.hashService.compare(
					loginUserDto.password,
					hashedPassword,
				);
				return isMatch;
			}),
		);

		const verifedPassword = isMatch.pipe(
			Effect.flatMap((isMatch) => {
				if (!isMatch) {
					this.logger.info("Incorrect password");
					return Effect.fail(new IncorrectPasswordError());
				}
				this.logger.info("Password is correct");
				return Effect.succeed(isMatch);
			}),
		);

		const userLogin = pipe(
			Effect.all([user, verifedPassword]),
			Effect.andThen(([user, isMatch]) => {
				const token = this.jwtService.generate({
					email: user.getEmail().getEmail(),
					id: user.getId(),
					role: user.getRole().getType(),
				});
				return Effect.map(token, (token) => ({
					accessToken: token,
					user: user.getEmail().getEmail(),
					role: user.getRole().getType(),
				}));
			}),
		);

		return userLogin;
	}

	getAllUsers(loggedInUserRole: string) {
		if (loggedInUserRole !== RoleType.ADMIN) {
			return Effect.fail(new UnauthorizedUserError());
		}

		const users = this.userRepository.getAllUsers();

		const usersRetrieval = users.pipe(
			Effect.flatMap((users) => {
				if (users.length === 0) {
					this.logger.info("No users found");
					return Effect.fail(new UserNotFoundError());
				}
				this.logger.info("Users retrieved successfully");
				return Effect.succeed(
					users.map((user) => user.serializeWithoutPassword()),
				);
			}),
		);

		return usersRetrieval;
	}

	deleteUser(id: string, loggedInUserRole: string, loggedInUserId: string) {
		if (loggedInUserRole !== RoleType.ADMIN) {
			return Effect.fail(new UnauthorizedUserError());
		}

		if (id === loggedInUserRole) {
			return Effect.fail(new SelfDeletionError());
		}

		const userOption = this.userRepository.getById(id);

		const user = userOption.pipe(
			Effect.flatMap((user) =>
				Option.match(user, {
					onSome: (user) => {
						this.logger.info("User found");
						return Effect.succeed(user);
					},
					onNone: () => {
						this.logger.info("User not found");
						return Effect.fail(new UserNotFoundError());
					},
				}),
			),
		);

		const userRole = user.pipe(Effect.map((user) => user.getRole().getType()));

		const userAdminUpdates = userRole.pipe(
			Effect.flatMap((userRole) => {
				if (userRole === RoleType.ADMIN) {
					return this.docRepository.updateDocumentCreatorId(id, loggedInUserId);
				}
				return Effect.succeed(-2);
			}),
		);

		const userDeletion = pipe(
			Effect.all([userAdminUpdates, user]),
			Effect.andThen(([userAdminUpdates, user]) => {
				if (userAdminUpdates === -2) {
					return this.userRepository.deleteUser(id);
				}
				if (userAdminUpdates === -1) {
					return Effect.fail(new UserDeletionError());
				}
				return this.userRepository.deleteUser(id);
			}),
			Effect.map((userDeletionOption) =>
				Option.match(userDeletionOption, {
					onSome: () => {
						return true;
					},
					onNone: () => {
						return false;
					},
				}),
			),
		);

		return userDeletion;
		// const userDeletion = pipe(
		// 	Effect.all([user, userOption]),
		// 	Effect.andThen(([user, userOption]) => {
		// 		if (user.getRole().getType() === RoleType.ADMIN) {
		// 			return this.userRepository.deleteUser(id);
		// 		}
		// 		return this.userRepository.deleteUser(id);
		// 	}),
		// 	Effect.andThen((userDeletionOption) => {
		// 		Option.match(userDeletionOption, {
		// 			onSome: () => {
		// 				return Effect.succeed(true);
		// 			},
		// 			onNone: () => {
		// 				return Effect.fail(new UserDeletionError());
		// 			},
		// 		});
		// 	}),
		// 	Effect.map((userDeletionComplete) => () => true),
		// );

		// return userDeletion;
	}
}
