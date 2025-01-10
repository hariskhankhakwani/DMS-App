import { metadata } from "reflect-metadata/no-conflict";
import { MetadataModel } from "./docmentMetadataModel";
import { DocumentModel } from "./documentModel";
import { JoinTable,Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';


@Entity('tags')
export class TagModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @ManyToOne(() => MetadataModel, metadata => metadata.tags)
    @JoinTable()
    metadata: MetadataModel;
}