import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { CommonStringEntity } from '../../common/model/common-string.entity';
import { UserContactEntity } from './user-contact.entity';
import { PropertyEntity } from '../../property/model/property.entity';
import { LangEntity } from "../../lang/model/lang.entity";

@Entity('user-contact2string')
export class UserContact2stringEntity extends BaseEntity implements CommonStringEntity<UserContactEntity> {

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
    () => UserContactEntity,
    user => user.string,
    { onDelete: 'CASCADE' },
  )
  parent: UserContactEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

  @ManyToOne(
    () => LangEntity,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  lang?: LangEntity;

}