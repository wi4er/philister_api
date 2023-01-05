import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, VersionColumn, OneToMany
} from 'typeorm';
import { UserGroup2stringEntity } from "./user-group2string.entity";
import { User2flagEntity } from "./user2flag.entity";
import { UserGroup2flagEntity } from "./user-group2flag.entity";
import { User2userGroupEntity } from "./user2user-group.entity";

@Entity('user-group')
export class UserGroupEntity extends BaseEntity {

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
    type => User2userGroupEntity,
    user => user.group,
  )
  user: User2userGroupEntity[];

  @OneToMany(
    type => UserGroup2stringEntity,
    property => property.parent,
  )
  string: UserGroup2stringEntity[];

  @OneToMany(
    type => UserGroup2flagEntity,
    flag => flag.parent,
  )
  flag: User2flagEntity[];

}