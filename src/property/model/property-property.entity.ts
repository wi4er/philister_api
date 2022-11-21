import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { PropertyEntity } from "./property.entity";

@Entity({
  name: 'property-property'
})
export class PropertyPropertyEntity extends BaseEntity {

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
    () => PropertyEntity,
    property => property.property,
    {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    },
  )
  parent: PropertyEntity;

  @ManyToOne(
    () => PropertyEntity,
    {onDelete: 'CASCADE'},
  )
  property: PropertyEntity;

}
