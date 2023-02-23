import {
  BaseEntity, Check,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { Directory2stringEntity } from './directory2string.entity';
import { ValueEntity } from './value.entity';
import { Directory2flagEntity } from "./directory2flag.entity";

@Entity('directory')
@Check('not_empty_id', '"id" > \'\'')
export class DirectoryEntity extends BaseEntity {

  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 100,
  })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => Directory2stringEntity,
    propertyProperty => propertyProperty.parent,
  )
  string: Directory2stringEntity[];

  @OneToMany(
    type => ValueEntity,
    value => value.directory,
  )
  value: ValueEntity[];

  @OneToMany(
    type => Directory2flagEntity,
    string => string.parent,
  )
  flag: Directory2flagEntity[];

}