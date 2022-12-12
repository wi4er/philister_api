import {
  BaseEntity, Check,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { DirectoryStringEntity } from './directory-string.entity';
import { ValueEntity } from './value.entity';
import { DirectoryFlagEntity } from "./directory-flag.entity";

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
    type => DirectoryStringEntity,
    propertyProperty => propertyProperty.parent,
  )
  string: DirectoryStringEntity[];

  @OneToMany(
    type => ValueEntity,
    value => value.directory,
  )
  value: ValueEntity[];

  @OneToMany(
    type => DirectoryFlagEntity,
    string => string.parent,
  )
  flag: DirectoryFlagEntity[];

}