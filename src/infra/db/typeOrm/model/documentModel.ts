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
import { MetadataModel } from "./docmentMetadataModel";
import type { UserModel } from "./userModel";

@Entity("documents")
export class DocumentModel {
	@PrimaryColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column({ type: "bytea" })
	content: Uint8Array;

	@OneToOne(
		() => MetadataModel,
		(metadata) => metadata.document,
	)
	metaData: MetadataModel;

	@ManyToOne("UserModel", "documents")
	@JoinColumn({ name: "userId", referencedColumnName: "id" })
	user: Relation<UserModel>;
}
