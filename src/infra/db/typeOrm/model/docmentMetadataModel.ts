import { DocumentModel } from "./documentModel";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinTable } from 'typeorm';
import { TagModel } from "./metadataTagModel";

@Entity('metadata')
export class MetadataModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    author: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TagModel, tags => tags.metadata)
    tags: TagModel[];

    @OneToOne(() => DocumentModel, document => document.metaData)
    document: DocumentModel;
}