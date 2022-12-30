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
import { BlockEntity } from "./block.entity";
import { ElementValueEntity } from "./element-value.entity";
import { SectionStringEntity } from "./section-string.entity";

@Entity('content-section')
export class SectionEntity extends BaseEntity {

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
    block => block.section,
    {
      onDelete: 'CASCADE',
      nullable: false,
    }
  )
  block: BlockEntity;

  @OneToMany(
    type => SectionStringEntity,
    property => property.parent,
  )
  string: SectionStringEntity[];

  @OneToMany(
    type => ElementSectionEntity,
    section => section.section,
  )
  element: ElementSectionEntity[];

  @OneToMany(
    type => ElementValueEntity,
    value => value.parent,
  )
  value: ElementValueEntity[];

}