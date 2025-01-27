import { Effect, Option, pipe } from "effect";
import { inject, injectable } from "inversify";
import { User } from "../../domain/aggregate/User";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/valueObjects/Email";
import { UserMapper } from "../../infra/db/typeOrm/mapper/userMapper";
import { TYPES } from "../../infra/di/inversify/types";
import type { LoginUserRequest, RegisterUserRequest } from "../dtos/userDtos";
import {
	BaseUserError,
	IncorrectPasswordError,
	InvalidTokenError,
	UserAlreadyExistsError,
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

	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserRepository) userRepository: IUserRepository,
		@inject(TYPES.IHashingService) hashingService: IHashing,
		@inject(TYPES.IJwt) jwtService: IJwt,
	) {
		this.userRepository = userRepository;
		this.hashService = hashingService;
		this.logger = logger;
		this.jwtService = jwtService;
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
}
