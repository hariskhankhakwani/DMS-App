import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import type { MetadataModel } from "./docmentMetadataModel";

@Entity("tags")
export class TagModel {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ length: 50 })
	name: string;

	@Column()
	metaDataId: string;

	@ManyToOne("MetadataModel", "tags")
	@JoinColumn({ name: "metaDataId", referencedColumnName: "id" })
	metadata: Relation<MetadataModel>;
}
