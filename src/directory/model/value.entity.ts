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
import { ValueStringEntity } from "./value.string.entity";

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
    type => ValueStringEntity,
    string => string.parent,
  )
  string: ValueStringEntity;

  @ManyToOne(
    type => DirectoryEntity,
    directory => directory.value,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  directory: DirectoryEntity;

}