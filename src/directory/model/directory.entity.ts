import { BaseEntity, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DirectoryPropertyEntity } from "./directory-property.entity";
import { ValueEntity } from "./value.entity";

@Entity({
  name: "directory"
})
export class DirectoryEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar"
  })
  id: string

  @OneToMany(
    type => DirectoryPropertyEntity,
    propertyProperty => propertyProperty.parent,
  )
  property: DirectoryPropertyEntity[]

  @OneToMany(
    type => ValueEntity,
    value => value.directory,
  )
  value: DirectoryPropertyEntity[]

}