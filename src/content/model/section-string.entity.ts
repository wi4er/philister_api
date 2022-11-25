import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn, Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { ElementEntity } from "./element.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { SectionEntity } from "./section.entity";

@Entity('section-string')
export class SectionStringEntity extends BaseEntity {

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