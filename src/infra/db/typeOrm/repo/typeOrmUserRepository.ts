import type { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserModel } from '../model/userModel';
import { User } from '../../../../domain/aggregate/User';
import { UserMapper } from '../mapper/userMapper';
import { AppDataSource } from '../dataSource';
import { Repository } from 'typeorm';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/inversify/types';
import type { ILogger } from '../../../../app/ports/logger/ILogger';

@injectable()
export class typeOrmUserRepository implements IUserRepository {
  userModel: Repository<UserModel>;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    this.userModel = AppDataSource.getRepository(UserModel);
    this.logger = logger;
  }

  async createUser(user: User): Promise<Result<User, Error>> {
    try {
      const userModel = UserMapper.toModel(user);
      await this.userModel.save(userModel);

      this.logger.info(`created user ${user.getEmail().getEmail()}`);
      return Ok(UserMapper.toDomain(userModel));
    } catch (error) {
      this.logger.error(`failed to create user ${user.getEmail().getEmail()}: ${error}`);
      return Err(error as Error);
    }
  }

  async getByEmail(email: string): Promise<Result<Option<UserModel>, Error>> {
    try {
      const userModel = await this.userModel.findOne({ where: { email } });

      if (userModel) {
        this.logger.info(`user found with ${email}`);
        return Ok(Some(userModel));
      }
      this.logger.warn(`user not  found with ${email}`);
      return Ok(None);
    } catch (error) {
      this.logger.error(`failed to get user ${email}: ${error}`);
      return Err(error as Error);
    }
  }

  async deleteUser(user: User): Promise<boolean> {
    const result = await this.userModel.delete(user.getId());
    return Boolean(result.affected);
  }

  async updateUser(user: User): Promise<User> {
    const userModel = UserMapper.toModel(user);
    await this.userModel.save(userModel);
    return UserMapper.toDomain(userModel);
  }
}
