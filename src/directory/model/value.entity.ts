import {
  BaseEntity, Check,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { DirectoryEntity } from "./directory.entity";
import { Value2stringEntity } from "./value2string.entity";
import { Directory2flagEntity } from "./directory2flag.entity";
import { ValueFlagEntity } from "./value-flag.entity";

@Entity({
  name: 'value'
})
@Check('not_empty_id', '"id" > \'\'')
export class ValueEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar"
  })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => Value2stringEntity,
    string => string.parent,
  )
  string: Value2stringEntity;

  @ManyToOne(
    type => DirectoryEntity,
    directory => directory.value,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  directory: DirectoryEntity;


  @OneToMany(
    type => ValueFlagEntity,
    string => string.parent,
  )
  flag: ValueFlagEntity[];

}