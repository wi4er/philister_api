import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn, Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserContactEntity } from "./user-contact.entity";

@Entity('user-contact2flag')
export class UserContact2flagEntity extends BaseEntity {

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
    () => UserContactEntity,
    user => user.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: UserContactEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}