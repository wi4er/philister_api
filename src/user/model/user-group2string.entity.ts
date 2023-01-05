import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { UserEntity } from "./user.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { CommonStringEntity } from "../../common/model/common-string.entity";
import { UserGroupEntity } from "./user-group.entity";

@Entity('user-group2string')
export class UserGroup2stringEntity extends BaseEntity implements CommonStringEntity<UserGroupEntity> {

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

  @Column()
  string: string;

  @ManyToOne(
    () => UserGroupEntity,
    group => group.string,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: UserGroupEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}