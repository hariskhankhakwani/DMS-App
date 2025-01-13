
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserModel } from '../model/userModel';
import { User } from '../../../../domain/aggregate/User';
import { UserMapper } from '../mapper/userMapper';
import { AppDataSource } from '../dataSource';
import { Repository } from 'typeorm';

export class typeOrmUserRepository implements IUserRepository {
  userModel: Repository<UserModel> ;
  
  constructor(){
    this.userModel=AppDataSource.getRepository(UserModel)
  }
  
  async createUser(user: User): Promise<User> {
    const userModel = UserMapper.toModel(user);
    await this.userModel.save(userModel);
    return UserMapper.toDomain(userModel);
  }

  async deleteUser(user: User): Promise<boolean> {
    const result = await this.userModel.delete(user.getId());
    return Boolean(result.affected);
  }

  async getByEmail(email: string): Promise<User | false > {
    const userModel = await this.userModel.findOne({ where: { email } });
    if (!userModel) {
      return false
    }
    return UserMapper.toDomain(userModel);
  }

  async getById(id: string): Promise<User | false> {
    const userModel = await this.userModel.findOne({ where: { id } });
    if (!userModel) {
      return false
    }
    return UserMapper.toDomain(userModel);
  }

  async updateUser(user: User): Promise<User> {
    const userModel = UserMapper.toModel(user);
    await this.userModel.save(userModel);
    return UserMapper.toDomain(userModel);
  }

}