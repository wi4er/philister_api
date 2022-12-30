import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, VersionColumn
} from 'typeorm';
import { UserStringEntity } from './user-string.entity';
import { UserFlagEntity } from "./user-flag.entity";
import { UserValueEntity } from "./user-value.entity";
import { UserUserEntity } from "./user-user.entity";
import { UserDescriptionEntity } from "./user-description.entity";
import { UserContactEntity } from "./user-contact.entity";

@Entity('user')
export class UserEntity extends BaseEntity {

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
    unique: true,
  })
  login: string;

  @Column({ nullable: true })
  hash: string;

  @OneToMany(
    type => UserContactEntity,
    contact => contact.user,
  )
  contact: UserContactEntity[];

  @OneToMany(
    type => UserStringEntity,
    property => property.parent,
  )
  string: UserStringEntity[];

  @OneToMany(
    type => UserDescriptionEntity,
    property => property.parent,
  )
  description: UserDescriptionEntity[];

  @OneToMany(
    type => UserValueEntity,
    value => value.parent,
  )
  value: UserValueEntity[];

  @OneToMany(
    type => UserFlagEntity,
    flag => flag.parent,
  )
  flag: UserFlagEntity[];

  @OneToMany(
    type => UserUserEntity,
    user => user.parent,
  )
  child: UserUserEntity[];

}