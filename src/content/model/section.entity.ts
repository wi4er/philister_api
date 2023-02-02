import {
  BaseEntity,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { Element2sectionEntity } from "./element2section.entity";
import { BlockEntity } from "./block.entity";
import { Element2valueEntity } from "./element2value.entity";
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
    type => Element2sectionEntity,
    section => section.section,
  )
  element: Element2sectionEntity[];

  @OneToMany(
    type => Element2valueEntity,
    value => value.parent,
  )
  value: Element2valueEntity[];

}