import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyEntity } from "./property.entity";

@Entity({
  name: "property-property"
})
export class PropertyPropertyEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // @Column({nullable: true})
  @Column()
  value: string

  @ManyToOne(
    () => PropertyEntity,
    property => property.property,
    {onDelete: "CASCADE"},
  )
  parent: PropertyEntity

  @ManyToOne(
    () => PropertyEntity,
    property => property.property,
    {onDelete: "CASCADE"},
  )
  property: PropertyEntity

}
