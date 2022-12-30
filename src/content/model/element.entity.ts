import {
  BaseEntity,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ElementSectionEntity } from "./element-section.entity";
import { ElementStringEntity } from "./element-string.entity";
import { BlockEntity } from "./block.entity";
import { ElementValueEntity } from "./element-value.entity";

@Entity('content-element')
export class ElementEntity extends BaseEntity {

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
    type => BlockEntity,
    block => block.element,
    {
      onDelete: 'CASCADE',
      nullable: false,
    }
  )
  block: BlockEntity;

  @OneToMany(
    type => ElementSectionEntity,
    section => section.parent,
  )
  section: ElementSectionEntity[];

  @OneToMany(
    type => ElementStringEntity,
    property => property.parent,
  )
  string: ElementStringEntity[];

  @OneToMany(
    type => ElementValueEntity,
    value => value.parent,
  )
  value: ElementValueEntity[];

}