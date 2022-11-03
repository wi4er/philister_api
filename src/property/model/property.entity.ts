import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: "property"
})
export class PropertyEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar"
  })
  id: string

}
