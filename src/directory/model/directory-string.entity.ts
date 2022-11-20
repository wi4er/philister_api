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

@Entity({
  name: 'directory-string'
})
export class DirectoryStringEntity extends BaseEntity {
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
    directory => directory.property,
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
}