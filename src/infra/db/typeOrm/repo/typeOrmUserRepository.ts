
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserModel } from '../model/userModel';
import { User } from '../../../../domain/aggregate/User';
import { Repository } from 'typeorm';
import { UserMapper } from '../mapper/userMapper';

export class UserRepository extends Repository<UserModel> implements IUserRepository {
  async createUser(user: User): Promise<User> {
    const userModel = UserMapper.toModel(user);
    await this.save(userModel);
    return UserMapper.toDomain(userModel);
  }

  async deleteUser(user: User): Promise<boolean> {
    const result = await this.delete(user.getId());
    return Boolean(result.affected);
  }

  async getByEmail(email: string): Promise<User | false > {
    const userModel = await this.findOne({ where: { email } });
    if (!userModel) {
      return false
    }
    return UserMapper.toDomain(userModel);
  }

  async getById(id: string): Promise<User | false> {
    const userModel = await this.findOne({ where: { id } });
    if (!userModel) {
      return false
    }
    return UserMapper.toDomain(userModel);
  }

  async updateUser(user: User): Promise<User> {
    const userModel = UserMapper.toModel(user);
    await this.save(userModel);
    return UserMapper.toDomain(userModel);
  }

}