import type{ Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export const validationMiddleware = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToClass(dtoClass, req.body, { excludeExtraneousValues: true });
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            const formattedErrors = errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }));
             res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: formattedErrors
            });
        }

        req.body = dtoInstance;
        next();
    };
};