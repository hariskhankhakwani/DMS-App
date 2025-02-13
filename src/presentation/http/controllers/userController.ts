import { Effect, Either } from "effect";
import { NoSuchElementException } from "effect/Cause";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RegisterUserRequest } from "../../../app/dtos/userDtos";
import type { HashGenerationError } from "../../../app/errors/hashErrors";
import type { JwtGenerationError } from "../../../app/errors/jwtError";
import type {
	IncorrectPasswordError,
	UserAlreadyExistsError,
	UserCreationError,
	UserNotFoundError,
} from "../../../app/errors/userErrors";
import type { ILogger } from "../../../app/ports/logger/ILogger";
import type { UserService } from "../../../app/services/userService";
import { TYPES } from "../../../infra/di/inversify/types";

@injectable()
export class UserController {
	constructor(
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ILogger) private logger: ILogger,
	) {}

	registerUser = async (req: Request, res: Response) => {
		const response = this.userService.registerUser(req.body);

		const responseMatch = Effect.match(response, {
			onSuccess: (user) => {
				this.logger.info("User registered successfully");
				return {
					code: 201,
					message: "Registered user successfully",
					data: user,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to register user");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};
	loginUser = async (req: Request, res: Response) => {
		const response = this.userService.loginUser(req.body);
		const responseMatch = Effect.match(response, {
			onSuccess: (userLogin) => {
				this.logger.info("User logged in successfully");
				return { code: 200, message: "logged in sucessfully", data: userLogin };
			},
			onFailure: (error) => {
				this.logger.error("failed to retrieve users");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				this.logger.info(resp.message);
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				res.status(500).json({ code: error.code, message: error.message });
			});
	};

	getAllUsers = async (req: Request, res: Response) => {
		const response = this.userService.getAllUsers(req.body.loggedInUserRole);
		const responseMatch = Effect.match(response, {
			onSuccess: (users) => {
				this.logger.info("Users retrieved successfully");
				return {
					code: 200,
					message: "Users retrieved successfully",
					data: users,
				};
			},
			onFailure: (error) => {
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	deleteUser = async (req: Request, res: Response) => {
		const response = this.userService.deleteUser(
			req.body.userId,
			req.body.loggedInUserRole,
			req.body.loggedInUserId,
		);
		const responseMatch = Effect.match(response, {
			onSuccess: (user) => {
				this.logger.info("User deleted successfully");
				return {
					code: 200,
					message: "User deleted successfully",
					data: user,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to delete user");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};

	updateUserRole = async (req: Request, res: Response) => {
		const response = this.userService.updateUserRole(
			req.body.userId,
			req.body.role,
			req.body.loggedInUserRole,
		);
		const responseMatch = Effect.match(response, {
			onSuccess: (user) => {
				this.logger.info("User role updated successfully");
				return {
					code: 200,
					message: "User role updated successfully",
					data: user,
				};
			},
			onFailure: (error) => {
				this.logger.error("failed to update user role");
				return {
					code: error.code,
					message: error.message,
					data: error,
				};
			},
		});
		Effect.runPromise(responseMatch)
			.then((resp) => {
				res.status(resp.code).json({
					message: resp.message,
					data: resp.data,
				});
			})
			.catch((error) => {
				this.logger.error(error.message);
				res.status(500).json({ message: error.message });
			});
	};
}
