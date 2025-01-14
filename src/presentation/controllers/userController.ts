import type { Request, Response, NextFunction } from "express";
import { inject, injectable } from 'inversify';
import { PinoLogger } from "../../infra/logger/pinoLogger";
import { TYPES } from '../../infra/di/inversify/types';
import { UserService } from '../../app/services/userService';
import  type{ ILogger } from '../../app/ports/logger/ILogger';


@injectable()
export class UserController {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.ILogger) private logger: ILogger
    ) {}

    registerUser =  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.userService.registerUser(req.body);
            this.logger.info(`User registered successfully: ${req.body.email}`);
            
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}