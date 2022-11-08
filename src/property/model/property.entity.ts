import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PropertyPropertyEntity } from "./property-property.entity";

@Entity({
  name: "property"
})
export class PropertyEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar"
  })
  id: string

  @OneToMany(
    type => PropertyPropertyEntity,
    propertyProperty => propertyProperty.parent,
  )
  property: PropertyPropertyEntity[]

}
