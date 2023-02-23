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
import { LangEntity } from "../../lang/model/lang.entity";
import { CommonStringEntity } from "../../common/model/common-string.entity";

@Entity({
  name: 'value-string'
})
export class Value2stringEntity extends BaseEntity implements CommonStringEntity<ValueEntity> {

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

  @ManyToOne(
    () => LangEntity,
    {
      onDelete: "CASCADE",
      nullable: true,
    },
  )
  lang?: LangEntity;

}