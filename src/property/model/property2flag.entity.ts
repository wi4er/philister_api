import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { BlockEntity } from '../../content/model/block.entity';
import { FlagEntity } from '../../flag/model/flag.entity';
import { PropertyEntity } from './property.entity';
import { CommonFlagEntity } from '../../common/model/common-flag.entity';

@Entity('property2flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class Property2flagEntity extends BaseEntity implements CommonFlagEntity<PropertyEntity> {

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
    () => PropertyEntity,
    property => property.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: PropertyEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}