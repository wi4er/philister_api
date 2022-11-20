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
import { ValueEntity } from "./value.entity";

@Entity({
  name: 'value-string'
})
export class ValueStringEntity extends BaseEntity {
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
    () => ValueEntity,
    directory => directory.string,
    {
      onDelete: "CASCADE",
      nullable: false,
    },
  )
  parent: ValueEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: "CASCADE",
      nullable: false,
    },
  )
  property: PropertyEntity;
}