import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { PropertyEntity } from '../../property/model/property.entity';
import { ElementEntity } from './element.entity';
import { LangEntity } from "../../lang/model/lang.entity";
import { CommonStringEntity } from "../../common/model/common-string.entity";

@Entity('element-string')
export class ElementStringEntity extends BaseEntity implements CommonStringEntity<ElementEntity> {

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
    () => LangEntity,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  lang?: LangEntity;

  @ManyToOne(
    () => ElementEntity,
    element => element.string,
    {
      nullable: false,
      onDelete: 'CASCADE'
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