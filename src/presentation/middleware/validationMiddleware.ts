import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validationMiddleware = (dtoClass: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dtoInstance = plainToInstance(dtoClass, req.body, {
			excludeExtraneousValues: true,
		});
		const errors = await validate(dtoInstance);

		if (errors.length > 0) {
			const formattedErrors = errors.map((error) => ({
				property: error.property,
				constraints: error.constraints,
			}));
			res.status(400).json({
				status: "error",
				message: "Validation failed",
				errors: formattedErrors,
			});
			return;
		}

		req.body = dtoInstance;
		next();
	};
};
