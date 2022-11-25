import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ElementEntity } from "./element.entity";
import { SectionEntity } from "./section.entity";
import { BlockStringEntity } from "./block-string.entity";

@Entity('block')
export class BlockEntity extends BaseEntity {

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

  @OneToMany(
    type => ElementEntity,
    element => element.block,
  )
  element: ElementEntity;

  @OneToMany(
    type => SectionEntity,
    section => section.block,
  )
  section: SectionEntity;

  @OneToMany(
    type => BlockStringEntity,
    property => property.parent,
  )
  string: BlockStringEntity[];

}