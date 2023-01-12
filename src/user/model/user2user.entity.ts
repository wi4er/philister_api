import {
  BaseEntity,
  CreateDateColumn, DeleteDateColumn,
  Entity, Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { UserEntity } from "./user.entity";
import { PropertyEntity } from "../../property/model/property.entity";

@Entity('user2user')
@Index([ 'user', 'parent', 'property'], { unique: true })
export class User2userEntity extends BaseEntity {

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
    user => user.string,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: UserEntity;

  @ManyToOne(
    () => UserEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  user: UserEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}