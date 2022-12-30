import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ValueEntity } from "../../directory/model/value.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { ElementEntity } from "./element.entity";

@Entity('content-element-value')
export class ElementValueEntity extends BaseEntity {

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

  @ManyToOne(
    () => ValueEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  value: ValueEntity;

  @ManyToOne(
    () => ElementEntity,
    element => element.value,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: ElementEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}