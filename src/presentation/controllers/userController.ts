import { Effect, Either } from "effect";
import { NoSuchElementException } from "effect/Cause";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RegisterUserRequest } from "../../app/dtos/userDtos";
import type { HashGenerationError } from "../../app/errors/hashErrors";
import type { JwtGenerationError } from "../../app/errors/jwtError";
import type {
	IncorrectPasswordError,
	UserAlreadyExistsError,
	UserCreationError,
	UserNotFoundError,
} from "../../app/errors/userErrors";
import type { ILogger } from "../../app/ports/logger/ILogger";
import type { UserService } from "../../app/services/userService";
import { TYPES } from "../../infra/di/inversify/types";

@injectable()
export class UserController {
	constructor(
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ILogger) private logger: ILogger,
	) {}

	registerUser = async (req: Request, res: Response) => {
		const response = this.userService.registerUser(req.body);
		Effect.runPromise(response)
			.then((user) => {
				this.logger.info("User registered successfully");
				res.json({
					code: 201,
					message: "Registered user successfully",
					data: user,
				});
			})
			.catch((error) => {
				this.logger.error("failed to register user");
				res.status(409).json({ message: error.message });
			});
	};
	loginUser = async (req: Request, res: Response) => {
		const response = this.userService.loginUser(req.body);
		Effect.runPromise(response)
			.then((user) => {
				this.logger.info("User logged in successfully");
				res.json({
					code: 200,
					message: "User logged in successfully",
					data: user,
				});
			})
			.catch((error) => {
				this.logger.error("failed to login user");
				res.status(409).json({ code: error.code, message: error.message });
			});
	};

	getAllUsers = async (req: Request, res: Response) => {
		const response = this.userService.getAllUsers(req.body.loggedInUserRole);
		Effect.runPromise(response)
			.then((users) => {
				this.logger.info("Users retrieved successfully");
				res.json({
					code: 200,
					message: "Users retrieved successfully",
					data: users,
				});
			})
			.catch((error) => {
				this.logger.error("failed to retrieve users");
				if (error.name.split(" ")[1] === "UnauthorizedUserError") {
					res.status(403).json({ message: error.message });
					return;
				}
				if (error.name.split(" ")[1] === "UserNotFoundError") {
					res.status(404).json({ message: error.message });
					return;
				}
				res.status(500).json({ message: error.message });
				return;
			});
	};

	deleteUser = async (req: Request, res: Response) => {
		console.log(req.body);
		const response = this.userService.deleteUser(
			req.body.userId,
			req.body.loggedInUserRole,
			req.body.loggedInUserId,
		);
		Effect.runPromise(response)
			.then((user) => {
				this.logger.info("User deleted successfully");
				res.json({
					code: 200,
					message: "User deleted successfully",
					data: user,
				});
			})
			.catch((error) => {
				this.logger.error("failed to delete user");
				res.status(409).json({ message: error.message });
			});
	};
}
