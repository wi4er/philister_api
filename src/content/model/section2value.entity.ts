import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { ValueEntity } from "../../directory/model/value.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { SectionEntity } from "./section.entity";

@Entity('content-section2value')
export class Section2valueEntity extends BaseEntity {

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
    () => ValueEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  value: ValueEntity;

  @ManyToOne(
    () => SectionEntity,
    element => element.value,
    {
      onDelete: 'CASCADE',
      nullable: false,
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