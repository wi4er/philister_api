import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { LangEntity } from "./lang.entity";
import { CommonStringEntity } from "../../common/model/common-string.entity";

@Entity('lang-string')
export class LangStringEntity extends BaseEntity implements CommonStringEntity<LangEntity> {

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

  @Column()
  string: string;

  @ManyToOne(
    () => LangEntity,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  lang?: LangEntity;

  @ManyToOne(
    () => LangEntity,
    lang => lang.string,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: LangEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}