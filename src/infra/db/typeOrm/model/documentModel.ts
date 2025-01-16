import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
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

  @OneToOne(() => MetadataModel, (metadata) => metadata.document)
  metaData: MetadataModel;

  @ManyToOne('UserModel', 'documents')
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Relation<UserModel>;
}
