import { Container } from "inversify";
import { TYPES } from "./types";
import { PinoLogger } from "../../logger/pinoLogger";
import type{ IHashing } from "../../../app/ports/hashing/IHashing";
import { Argon2HashingService } from "../../hashing/Argon2HashingService";
import type{ IJwt } from "../../../app/ports/jwt/IJwt";
import { JsonWebTokenJwt } from "../../jwt/JsonWebTokenJwt";
import type{ IUserRepository } from "../../../domain/repositories/IUserRepository";
import { typeOrmUserRepository } from "../../db/typeOrm/repo/typeOrmUserRepository";
import { UserService } from "../../../app/services/userService";
import { UserController } from "../../../presentation/controllers/userController";
import  type { ILogger } from "../../../app/ports/logger/ILogger";


const container = new Container();



container.bind<IHashing>(TYPES.IHashingService).to(Argon2HashingService);
container.bind<IJwt>(TYPES.IJwt).to(JsonWebTokenJwt);
container.bind<ILogger>(TYPES.ILogger).toConstantValue(new PinoLogger())
container.bind<IUserRepository>(TYPES.IUserRepository).to(typeOrmUserRepository);
container.bind<UserController>(UserController).toSelf();
container.bind<UserService>(TYPES.UserService).to(UserService);




export default container;