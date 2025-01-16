import { User } from '../../../../domain/aggregate/User';
import { UserModel } from '../model/userModel';
import { DocumentModel } from '../model/documentModel';
import { DocumentMapper } from './documentMapper';

export class UserMapper {
  static toDomain(userModel: UserModel): User {
    const user = User.deserialize({
      id: userModel.id,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      email: userModel.email,
      password: userModel.password,
      role: userModel.role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
    });

    if (userModel.documents) {
      userModel.documents.forEach((doc) => {
        const document = DocumentMapper.toDomain(doc);
        user.addDocument(document);
      });
    }

    return user;
  }

  static toModel(user: User): UserModel {
    const userModel = new UserModel();

    userModel.createdAt = user.getCreatedAt();
    userModel.email = user.getEmail().getEmail();
    userModel.firstName = user.getFirstName();
    userModel.id = user.getId();
    userModel.lastName = user.getLastName();
    userModel.password = user.getPassword();
    userModel.role = user.getRole().getType();
    userModel.updatedAt = user.getUpdatedAt();

    return userModel;
  }
}
