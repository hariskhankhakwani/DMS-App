import { User } from "../../../../domain/aggregate/User";
import { DocumentModel } from "../model/documentModel";
import { UserModel } from "../model/userModel";
import { DocumentMapper } from "./documentMapper";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserMapper {
	static toDomain(userModel: UserModel): User {
		const user = User.deserialize({
			id: userModel.id,
			firstName: userModel.firstName,
			lastName: userModel.lastName,
			email: userModel.email.toLowerCase(),
			password: userModel.password,
			role: userModel.role,
			createdAt: userModel.createdAt,
			updatedAt: userModel.updatedAt,
		});

		return user;
	}

	static toModel(user: User): UserModel {
		const userModel = new UserModel();

		userModel.createdAt = user.getCreatedAt();
		userModel.email = user.getEmail().getEmail().toLowerCase();
		userModel.firstName = user.getFirstName();
		userModel.id = user.getId();
		userModel.lastName = user.getLastName();
		userModel.password = user.getPassword();
		userModel.role = user.getRole().getType();
		userModel.updatedAt = user.getUpdatedAt();

		return userModel;
	}

	static toDomainMany(userModels: UserModel[]): User[] {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return userModels.map((userModel) => this.toDomain(userModel));
	}

	static toModelMany(users: User[]): UserModel[] {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		return users.map((user) => this.toModel(user));
	}
}
