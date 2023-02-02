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
import { Element2stringEntity } from "./element2string.entity";
import { BlockEntity } from "./block.entity";
import { Element2valueEntity } from "./element2value.entity";
import { WithStringEntity } from '../../common/model/with-string.entity';
import { Element2flagEntity } from './element2flag.entity';

@Entity('content-element')
export class ElementEntity extends BaseEntity implements WithStringEntity<ElementEntity> {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

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
    type => Element2sectionEntity,
    section => section.parent,
  )
  section: Element2sectionEntity[];

  @OneToMany(
    type => Element2stringEntity,
    property => property.parent,
  )
  string: Element2stringEntity[];

  @OneToMany(
    type => Element2flagEntity,
    flag => flag.parent,
  )
  flag: Element2flagEntity[];

  @OneToMany(
    type => Element2valueEntity,
    value => value.parent,
  )
  value: Element2valueEntity[];

}