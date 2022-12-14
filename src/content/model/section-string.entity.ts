import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn, Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { SectionEntity } from "./section.entity";
import { CommonStringEntity } from "../../common/model/common-string.entity";
import { LangEntity } from "../../lang/model/lang.entity";

@Entity('section-string')
export class SectionStringEntity extends BaseEntity implements CommonStringEntity<SectionEntity> {

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
    () => LangEntity,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  lang?: LangEntity;

  @ManyToOne(
    () => SectionEntity,
    section => section.string,
    {
      nullable: false,
      onDelete: 'CASCADE'
    },
  )
  parent: SectionEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}