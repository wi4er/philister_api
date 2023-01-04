import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, VersionColumn
} from 'typeorm';
import { User2stringEntity } from './user2string.entity';
import { User2flagEntity } from "./user2flag.entity";
import { User2valueEntity } from "./user2value.entity";
import { User2userEntity } from "./user2user.entity";
import { User2descriptionEntity } from "./user2description.entity";
import { User2userContactEntity } from "./user2user-contact.entity";

@Entity('user')
export class UserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @VersionColumn()
  version: number;

  @Column({
    unique: true,
  })
  login: string;

  @Column({ nullable: true })
  hash: string;

  @OneToMany(
    type => User2userContactEntity,
    contact => contact.user,
  )
  contact: User2userContactEntity[];

  @OneToMany(
    type => User2stringEntity,
    property => property.parent,
  )
  string: User2stringEntity[];

  @OneToMany(
    type => User2descriptionEntity,
    property => property.parent,
  )
  description: User2descriptionEntity[];

  @OneToMany(
    type => User2valueEntity,
    value => value.parent,
  )
  value: User2valueEntity[];

  @OneToMany(
    type => User2flagEntity,
    flag => flag.parent,
  )
  flag: User2flagEntity[];

  @OneToMany(
    type => User2userEntity,
    user => user.parent,
  )
  child: User2userEntity[];

}