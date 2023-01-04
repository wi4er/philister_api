import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PropertyEntity } from '../../property/model/property.entity';

@Entity('user2description')
export class User2descriptionEntity extends BaseEntity {

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

  @Column({
    type: 'text'
  })
  string: string;

  @ManyToOne(
    () => UserEntity,
    user => user.description,
    { onDelete: 'CASCADE' },
  )
  parent: UserEntity

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity

}