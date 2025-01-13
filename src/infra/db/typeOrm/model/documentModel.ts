import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
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

    // @OneToOne(() => MetadataModel, metadata => metadata.document)
    // metaData: MetadataModel;
    @Column()
    userId: string;

    @ManyToOne(() => UserModel, user => user.documents,{}) 
    @JoinColumn({name:"userId",referencedColumnName:"id"})
    user: UserModel;

   
}