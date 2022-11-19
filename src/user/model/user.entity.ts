import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { UserStringEntity } from './user-string.entity';
import { UserFlagEntity } from "./user-flag.entity";
import { UserValueEntity } from "./user-value.entity";
import { UserUserEntity } from "./user-user.entity";
import { UserGroupEntity } from "./user-group.entity";
import { UserDescriptionEntity } from "./user-description.entity";

@Entity({
  name: 'user'
})
export class UserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  login: string;

  @Column({nullable: true})
  hash: string

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