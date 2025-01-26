import { Effect, Option } from "effect";
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
		return this.userRepository.getByEmail(regUserDto.email.toLowerCase()).pipe(
			Effect.flatMap((userOption) =>
				Option.isSome(userOption)
					? Effect.fail(new UserAlreadyExistsError())
					: this.hashService.hash(regUserDto.password).pipe(
							Effect.flatMap((hashedPassword) =>
								Effect.try(() =>
									User.create(
										regUserDto.firstName,
										regUserDto.lastName,
										Email.create(regUserDto.email.toLowerCase()),
										hashedPassword,
									),
								).pipe(
									Effect.flatMap((hashedUser) =>
										this.userRepository.createUser(hashedUser),
									),
									Effect.map((user) => user.serialize()),
								),
							),
						),
			),
		);
	}

	loginUser(loginUserDto: LoginUserRequest) {
		return this.userRepository
			.getByEmail(loginUserDto.email.toLowerCase())
			.pipe(
				Effect.flatMap((userOption) =>
					Option.isNone(userOption)
						? Effect.fail(new UserNotFoundError())
						: userOption.pipe(
								Effect.flatMap((user) => {
									return this.hashService
										.compare(loginUserDto.password, user.getPassword())
										.pipe(
											Effect.flatMap((isMatch) =>
												!isMatch
													? Effect.fail(new IncorrectPasswordError())
													: this.jwtService
															.generate({
																email: loginUserDto.email.toLowerCase(),
																id: user.getId(),
																role: user.getRole().getType(),
															})
															.pipe(
																Effect.map((accessToken) => ({
																	id: user.getId(),
																	email: user.getEmail(),
																	accessToken,
																	role: user.getRole().getType(),
																})),
															),
											),
										);
								}),
							),
				),
			);
	}
}

// async loginUser(loginUserDto: dto.LoginUserRequest) {

// }

// async loginUser(loginUserDto: dto.LoginUserRequest): Promise<Result<dto.LoginUserResponse, UserNotFoundError>> {
//   const user = await this.userRepository.getByEmail(loginUserDto.email.toLowerCase());
//   if (user.isErr()) {
//     return Err(new InternalServerError());
//   }
//   if (user.unwrap().isSome()) {

//     if (!(await this.hashService.Compare(loginUserDto.password, user.unwrap().unwrap().password))) {
//       this.logger.warn(`incorrect password for ${loginUserDto.email.toLowerCase()}`);
//       return Err(new IncorrectPasswordError());
//     }

//     const accessToken = await this.jwtService.generate(loginUserDto.email.toLowerCase());

//     this.logger.info(`user with ${loginUserDto.email} logged in`);

//     return Ok({ id:user.unwrap().unwrap().id ,email:user.unwrap().unwrap().email ,accessToken });
//   }

//   this.logger.warn(`incorrect email: ${loginUserDto.email}`);
//   return Err(new UserNotFoundError());
// }
