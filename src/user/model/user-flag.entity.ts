import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserEntity } from "./user.entity";

@Entity({
  name: 'user-flag'
})
export class UserFlagEntity extends BaseEntity {

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
    {onDelete: 'CASCADE'},
  )
  parent: UserEntity;

  @ManyToOne(
    () => FlagEntity,
    {onDelete: 'CASCADE'},
  )
  flag: FlagEntity;

}