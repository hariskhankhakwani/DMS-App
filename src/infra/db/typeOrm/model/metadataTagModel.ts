import { MetadataModel } from "./docmentMetadataModel";
import { JoinTable,Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from 'typeorm';


@Entity('tags')
export class TagModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    metaDataId: string;

    @ManyToOne(() => MetadataModel, metadata => metadata.tags)
    @JoinColumn({name : "metaDataId" ,referencedColumnName : "id" })
    metadata: MetadataModel;
}