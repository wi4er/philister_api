import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { PropertyEntity } from './property.entity';
import { LangEntity } from '../../lang/model/lang.entity';
import { CommonStringEntity } from '../../common/model/common-string.entity';

@Entity('property2string')
export class Property2stringEntity extends BaseEntity implements CommonStringEntity<PropertyEntity> {

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
    () => PropertyEntity,
    property => property.string,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: PropertyEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}
