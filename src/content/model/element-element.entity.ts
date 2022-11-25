import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ElementEntity } from "./element.entity";
import { PropertyEntity } from "../../property/model/property.entity";

@Entity('element-element')
export class ElementElementEntity extends BaseEntity {

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
    () => ElementEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  element: ElementEntity;

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