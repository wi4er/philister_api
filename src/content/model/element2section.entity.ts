import {
  BaseEntity,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ElementEntity } from "./element.entity";
import { SectionEntity } from "./section.entity";

@Entity('content-element2section')
@Index([ 'parent', 'section' ], { unique: true })
export class Element2sectionEntity extends BaseEntity {

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
    type => ElementEntity,
    element => element.section,
    {
      onDelete: 'CASCADE',
      nullable: false,
    }
  )
  parent: ElementEntity;

  @ManyToOne(
    type => SectionEntity,
    section => section.element,
    {
      onDelete: 'CASCADE',
      nullable: false,
    }
  )
  section: SectionEntity;

}