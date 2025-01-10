import type { User } from "../aggregate/User";


export interface IUserRepository {
    createUser(user: User): Promise<User>;
    deleteUser(user: User): Promise<boolean>
    getByEmail(email: string): Promise<User | false>;
    getById(id: string): Promise<User | false>;
    updateUser(user : User): Promise<User>   

}