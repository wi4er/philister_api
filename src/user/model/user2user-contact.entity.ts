import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { UserContactEntity } from "./user-contact.entity";
import { UserEntity } from "./user.entity";

@Entity('user2user-contact')
@Index([ 'contact', 'value' ], { unique: true })
export class User2userContactEntity extends BaseEntity {

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
  value: string;

  @ManyToOne(
    type => UserContactEntity,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  contact: UserContactEntity;

  @ManyToOne(
    type => UserEntity,
    user => user.contact,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  parent: UserEntity;

  @Column({
    type: Boolean,
    default: false,
  })
  verify: boolean;

  @Column()
  verifyCode: string;

}