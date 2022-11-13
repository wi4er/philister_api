import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { DirectoryEntity } from "./directory.entity";

@Entity({
  name: 'directory-property'
})
export class DirectoryPropertyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(
    () => DirectoryEntity,
    directory => directory.property,
    {onDelete: "CASCADE"},
  )
  parent: DirectoryEntity;

  @ManyToOne(
    () => PropertyEntity,
    {onDelete: "CASCADE"},
  )
  property: PropertyEntity;
}