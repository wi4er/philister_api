import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { DirectoryEntity } from "./directory.entity";
import { LangEntity } from "../../lang/model/lang.entity";
import { CommonStringEntity } from "../../common/model/common-string.entity";

@Entity({
  name: 'directory-string'
})
export class DirectoryStringEntity extends BaseEntity implements CommonStringEntity<DirectoryEntity>{
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @VersionColumn()
  version: number;

  @Column()
  string: string;

  @ManyToOne(
    () => DirectoryEntity,
    directory => directory.string,
    {
      onDelete: "CASCADE",
      nullable: false,
    },
  )
  parent: DirectoryEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: "CASCADE",
      nullable: false,
    },
  )
  property: PropertyEntity;

  @ManyToOne(
    () => LangEntity,
    {
      onDelete: "CASCADE",
      nullable: false,
    },
  )
  lang: LangEntity;

}