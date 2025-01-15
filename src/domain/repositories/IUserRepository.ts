import type { UserModel } from "../../infra/db/typeOrm/model/userModel";
import type { User } from "../aggregate/User";
import { Result,Option } from "oxide.ts";

export interface IUserRepository {
    createUser(user: User): Promise<Result<User, Error>>;
    deleteUser(user: User): Promise<boolean>
    getByEmail(email: string): Promise<Result<Option<UserModel>, Error>>;
    updateUser(user : User): Promise<User>   

}