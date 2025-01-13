import { User } from "../../../../domain/aggregate/User";
import { UserModel } from "../model/userModel";


export class UserMapper {
    static toDomain(userModel:UserModel ): User {
        const user = User.deserialize(
            {   id : userModel.id,
                firstName:userModel.firstName,
                lastName:userModel.lastName,
                email:userModel.email,
                password :userModel.password,
                role:userModel.role,
                createdAt: userModel.createdAt,
                updatedAt : userModel.updatedAt
            }
        );
        
        return user
            
    }

    static toModel(user: User): UserModel {
    const userModel =  new UserModel()
    Object.assign(userModel,user.serialize())
    return userModel
    
    }
        
}