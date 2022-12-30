import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ContactEntity } from "./contact.entity";
import { UserEntity } from "./user.entity";

@Entity('user-contact')
@Index([ 'contact', 'value' ], { unique: true })
export class UserContactEntity extends BaseEntity {

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
    type => ContactEntity,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  contact: ContactEntity;

  @ManyToOne(
    type => UserEntity,
    user => user.contact,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  user: UserEntity;

}