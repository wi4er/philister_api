import {
  BaseEntity, Check, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany, PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { UserStringEntity } from "./user-string.entity";

export enum ContactType {

  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',

}

@Entity('contact')
@Check('not_empty_id', '"id" > \'\'')
export class ContactEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar",
    length: 50,
  })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => UserStringEntity,
    property => property.parent,
  )
  string: UserStringEntity[];

  @Column({
    type: 'enum',
    enum: ContactType,
    nullable: false,
  })
  type: ContactType;

}