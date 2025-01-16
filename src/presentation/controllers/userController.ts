import type { Request, Response, NextFunction } from "express";
import { inject, injectable } from 'inversify';
import { TYPES } from '../../infra/di/inversify/types';
import { UserService } from '../../app/services/userService';
import  type{ ILogger } from '../../app/ports/logger/ILogger';
import type { RegisterUserRequest, RegisterUserResponse } from "../../app/dtos/userDtos";
import { match } from "oxide.ts";


@injectable()
export class UserController {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.ILogger) private logger: ILogger
    ) {}

    registerUser =  async (req: Request, res: Response) => {
            match((await this.userService.registerUser(req.body)),{
            Ok: (_) => res.json({code: 200, message: "Registered user successfully", data: null}),
            Err: (err) => res.status(err.code).json({code: err.code, message: err.message, data: null})
            });
            
    };

    loginUser = async (req:Request , res: Response) =>{
        match(await this.userService.loginUser(req.body), {
            Ok: (resp) => res.json({code: 200, message: "User logged in successfully", data: resp}),
            Err: (err) => res.status(err.code).json({code: err.code, message: err.message, data: null})
        });
    }
}