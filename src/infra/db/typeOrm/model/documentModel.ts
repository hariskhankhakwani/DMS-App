import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import type { UserModel } from "./userModel";

@Entity("documents")
export class DocumentModel {
	@PrimaryColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column()
	path: string;

	@Column()
	creatorId: string;

	@Column()
	createdAt: Date;

	@Column()
	updatedAt: Date;

	@Column("text", { array: true }) tags: string[];

	@ManyToOne("UserModel", "documents")
	@JoinColumn({ name: "creatorId", referencedColumnName: "id" })
	user: Relation<UserModel>;
}
