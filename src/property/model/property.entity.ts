import {
  BaseEntity,
  Check,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { PropertyPropertyEntity } from "./property-property.entity";

@Entity({
  name: "property"
})
@Check('not_empty_id', '"id" > \'\'')
export class PropertyEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar",
    length: 50,
  })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => PropertyPropertyEntity,
    propertyProperty => propertyProperty.parent,
  )
  property: PropertyPropertyEntity[];

}
