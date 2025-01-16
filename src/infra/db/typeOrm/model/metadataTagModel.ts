import { MetadataModel } from './docmentMetadataModel';
import { JoinTable, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';

@Entity('tags')
export class TagModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  metaDataId: string;

  @ManyToOne('MetadataModel', 'tags')
  @JoinColumn({ name: 'metaDataId', referencedColumnName: 'id' })
  metadata: Relation<MetadataModel>;
}
