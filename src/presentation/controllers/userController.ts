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

	//   registerUser = async (req: Request, res: Response) => {
	//     matchRes(await this.userService.registerUser(req.body), {
	//       Ok: (_) => res.json({ code: 200, message: 'Registered user successfully', data: null }),
	//       Err: (err) => res.status(err.code).json({ code: err.code, message: err.message, data: null }),
	//     });
	//   };

	//   loginUser = async (req: Request, res: Response) => {
	//     matchRes(await this.userService.loginUser(req.body), {
	//       Ok: (resp) => res.json({ code: 200, message: 'User logged in successfully', data: resp }),
	//       Err: (err) => res.status(err.code).json({ code: err.code, message: err.message, data: null }),
	//     });
	//   };
	//
	registerUser = async (req: Request, res: Response) => {
		const response = this.userService.registerUser(req.body);
		Effect.runPromise(response)
			.then((user) =>
				res.json({
					code: 201,
					message: "Registered user successfully",
					data: user,
				}),
			)
			.catch((error) => res.status(409).json({ message: error.message }));
		// Effect.match(response, {
		// 	onFailure: (error) => {
		// 		return res
		// 			.status(error instanceof NoSuchElementException ? 400 : 500)
		// 			.json({ message: error.message });
		// 	},
		// 	onSuccess: (value) => {
		// 		return res.json({
		// 			code: 201,
		// 			message: "Registered user successfully",
		// 			data: value,
		// 		});
		// 	},
		// });
	};
	loginUser = async (req: Request, res: Response) => {
		const response = this.userService.loginUser(req.body);
		Effect.runPromise(response)
			.then((user) =>
				res.json({
					code: 200,
					message: "User logged in successfully",
					data: user,
				}),
			)
			.catch((error) =>
				res.status(409).json({ code: error.code, message: error.message }),
			);
	};

	// loginUser = async (req: Request, res: Response) => {
	//   const response = await this.userService.loginUser(req.body);
	//   return res.json({ response }) as never;
	// };
}
