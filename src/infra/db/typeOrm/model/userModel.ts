import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";
import { DocumentModel } from "./documentModel";

import { RoleType } from "../../../../domain/valueObjects/Role";

@Entity("users")
export class UserModel {
	@PrimaryColumn("uuid")
	id: string;

	@Column({ length: 50 })
	firstName: string;

	@Column({ length: 50 })
	lastName: string;

	@Column() //{ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ type: "enum", enum: RoleType })
	role: RoleType;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(
		() => DocumentModel,
		(document) => document.user,
	)
	documents: DocumentModel[];
}
