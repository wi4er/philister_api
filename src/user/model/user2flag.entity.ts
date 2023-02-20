import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { FlagEntity } from '../../flag/model/flag.entity';
import { UserEntity } from './user.entity';

@Entity('user2flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class User2flagEntity extends BaseEntity {

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
    () => UserEntity,
    user => user.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: UserEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}