import { Container } from "inversify";
import type { IEmail } from "../../../app/ports/email/IEmail";
import type { IHashing } from "../../../app/ports/hashing/IHashing";
import type { IJwt } from "../../../app/ports/jwt/IJwt";
import type { ILogger } from "../../../app/ports/logger/ILogger";
import type { IStorage } from "../../../app/ports/storage/IStorage";
import { DocumentService } from "../../../app/services/documentService";
import { EmailService } from "../../../app/services/emailService";
import { UserService } from "../../../app/services/userService";
import type { IDocumentRepository } from "../../../domain/repositories/IDocumentRespository";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { DocumentController } from "../../../presentation/controllers/documentController";
import { UserController } from "../../../presentation/controllers/userController";
import { typeOrmDocRepository } from "../../db/typeOrm/repo/typeOrmDocRepository";
import { typeOrmUserRepository } from "../../db/typeOrm/repo/typeOrmUserRepository";
import { MockEmail } from "../../email/mockEmail/mockEmail";
import { Argon2HashingService } from "../../hashing/Argon/Argon2HashingService";
import { JsonWebTokenJwt } from "../../jwt/JsonWebTokenJwt";
import { PinoLogger } from "../../logger/pinoLogger";
import { LocalStorage } from "../../storage/localStorage/localStorage";
import { TYPES } from "./types";
const container = new Container();

container.bind<IEmail>(TYPES.IEmail).to(MockEmail);
container.bind<IHashing>(TYPES.IHashingService).to(Argon2HashingService);
container.bind<IJwt>(TYPES.IJwt).to(JsonWebTokenJwt);
container.bind<ILogger>(TYPES.ILogger).toConstantValue(new PinoLogger());
container.bind<IStorage>(TYPES.IStorage).to(LocalStorage);

container
	.bind<IUserRepository>(TYPES.IUserRepository)
	.to(typeOrmUserRepository);

container
	.bind<IDocumentRepository>(TYPES.IDocumentItemRepository)
	.to(typeOrmDocRepository);

container.bind<DocumentController>(DocumentController).toSelf();
container.bind<UserController>(UserController).toSelf();
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<DocumentService>(TYPES.DocumentService).to(DocumentService);
export default container;
