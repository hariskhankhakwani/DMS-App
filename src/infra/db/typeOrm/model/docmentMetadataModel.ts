import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import type { DocumentModel } from "./documentModel";
import { TagModel } from "./metadataTagModel";

@Entity("metadata")
export class MetadataModel {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	author: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(
		() => TagModel,
		(tags) => tags.metadata,
	)
	tags: TagModel[];

	@OneToOne("DocumentModel", "metadata")
	@JoinColumn({ name: "documentId", referencedColumnName: "id" })
	document: Relation<DocumentModel>;
}
