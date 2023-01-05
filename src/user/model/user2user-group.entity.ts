import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn, Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { UserEntity } from "./user.entity";
import { UserGroupEntity } from "./user-group.entity";

@Entity('user2userGroup')
export class User2userGroupEntity extends BaseEntity {

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
    type => UserGroupEntity,
    group => group.user,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  group: UserGroupEntity;

  @ManyToOne(
    type => UserEntity,
    user => user.group,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  parent: UserEntity;

}