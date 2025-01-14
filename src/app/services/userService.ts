import * as dto from "../dtos/userDtos"
import type{ IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "inversify";
import { InvalidTokenError, UserAlreadyExistsError, UserNotFoundError } from "../errors/errors";
import { Email } from "../../domain/valueObjects/Email";
import type { IHashing } from "../ports/hashing/IHashing";

import type { IJwt } from "../ports/jwt/IJwt";
import { TYPES } from "../../infra/di/inversify/types";
import { User } from "../../domain/aggregate/User";
import type{ RegisterUserResponse } from "../dtos/userDtos";
import type   { ILogger } from "../ports/logger/ILogger";
@injectable()
export class UserService {
    private userRepository: IUserRepository;
    private hashService: IHashing;
    private jwtService: IJwt;
    private logger: ILogger;

    constructor(
        @inject( TYPES.ILogger ) logger: ILogger,
        @inject( TYPES.IUserRepository ) userRepository: IUserRepository,
        @inject( TYPES.IHashingService ) hashingService: IHashing,
        @inject( TYPES.IJwt) jwt: IJwt) 
        {
        this.userRepository = userRepository;
        this.hashService = hashingService;
        this.logger = logger;
        this.jwtService = jwt;
    }

    async registerUser(regUserDto: dto.RegisterUserRequest): Promise<RegisterUserResponse> {
        const user = await this.userRepository.getByEmail(regUserDto.email);
        if (user) {
            this.logger.warn(`user  ${regUserDto.email} already exists`);
            throw new UserAlreadyExistsError()
        }
        const newUser = User.create(regUserDto.firstName,regUserDto.lastName, Email.create(regUserDto.email), regUserDto.password);
        newUser.setPassword(await this.hashService.Hash(newUser.getPassword()));
        await this.userRepository.createUser(newUser);
        this.logger.info(`registered user ${regUserDto.email}`);

        return newUser.serialize()
        
    }


}
