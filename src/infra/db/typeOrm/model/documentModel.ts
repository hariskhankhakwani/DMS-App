import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { UserModel } from './userModel';
import { MetadataModel } from './docmentMetadataModel';

@Entity('documents')
export class DocumentModel {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'bytea' })
    content: Uint8Array;

    @OneToOne(() => MetadataModel, metadata => metadata.document)
    metaData: MetadataModel;

    @ManyToOne(() => UserModel, user => user.documents)
    user: UserModel;

   
}