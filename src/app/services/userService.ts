import * as dto from '../dtos/userDtos';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { inject, injectable } from 'inversify';
import {
  BaseUserError,
  IncorrectPasswordError,
  InvalidTokenError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../errors/userErrors';
import { Email } from '../../domain/valueObjects/Email';
import type { IHashing } from '../ports/hashing/IHashing';

import type { IJwt } from '../ports/jwt/IJwt';
import { TYPES } from '../../infra/di/inversify/types';
import { User } from '../../domain/aggregate/User';
import type { RegisterUserResponse } from '../dtos/userDtos';
import type { ILogger } from '../ports/logger/ILogger';
import { Err, Ok, type Result } from 'oxide.ts';
import { InternalServerError } from '../errors/appError';
import { UserMapper } from '../../infra/db/typeOrm/mapper/userMapper';
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

  async registerUser(
    regUserDto: dto.RegisterUserRequest,
  ): Promise<Result<RegisterUserResponse, UserAlreadyExistsError | InternalServerError>> {
    const user = await this.userRepository.getByEmail(regUserDto.email.toLowerCase());
    if (user.isErr()) {
      return Err(new InternalServerError());
    }
    if (user.unwrap().isNone()) {
      const newUser = User.create(
        regUserDto.firstName,
        regUserDto.lastName,
        Email.create(regUserDto.email.toLowerCase()),
        regUserDto.password,
      );
      newUser.setPassword(await this.hashService.Hash(newUser.getPassword()));
      await this.userRepository.createUser(newUser);
      this.logger.info(`registered user ${regUserDto.email.toLowerCase()}`);

      return Ok(newUser.serialize());
    }
    this.logger.warn(`user with ${regUserDto.email.toLowerCase()} already exists`);
    return Err(new UserAlreadyExistsError());
  }

  async loginUser(loginUserDto: dto.LoginUserRequest): Promise<Result<dto.LoginUserResponse, UserNotFoundError>> {
    const user = await this.userRepository.getByEmail(loginUserDto.email.toLowerCase());
    if (user.isErr()) {
      return Err(new InternalServerError());
    }
    if (user.unwrap().isSome()) {

      if (!(await this.hashService.Compare(loginUserDto.password, user.unwrap().unwrap().password))) {
        this.logger.warn(`incorrect password for ${loginUserDto.email.toLowerCase()}`);
        return Err(new IncorrectPasswordError());
      }

      const accessToken = await this.jwtService.generate(loginUserDto.email.toLowerCase());

      this.logger.info(`user with ${loginUserDto.email} logged in`);

      return Ok({ id:user.unwrap().unwrap().id ,email:user.unwrap().unwrap().email ,accessToken });
    }

    this.logger.warn(`incorrect email: ${loginUserDto.email}`);
    return Err(new UserNotFoundError());
  }
}
