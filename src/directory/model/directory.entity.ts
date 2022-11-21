import {
  BaseEntity, Check,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { DirectoryStringEntity } from "./directory-string.entity";
import { ValueEntity } from "./value.entity";

@Entity({
  name: "directory"
})
@Check('not_empty_id', '"id" > \'\'')
export class DirectoryEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar",
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
  deleted_at: Date;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => DirectoryStringEntity,
    propertyProperty => propertyProperty.parent,
  )
  property: DirectoryStringEntity[];

  @OneToMany(
    type => ValueEntity,
    value => value.directory,
  )
  value: ValueEntity[];

}