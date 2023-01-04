import {
  BaseEntity,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ValueEntity } from '../../directory/model/value.entity';
import { PropertyEntity } from '../../property/model/property.entity';

@Entity('user-contact2value')
@Index([ 'value', 'property', 'parent' ], { unique: true })
export class User2valueEntity extends BaseEntity {

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
    () => ValueEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  value: ValueEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.value,
    { onDelete: 'CASCADE' },
  )
  parent: UserEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}