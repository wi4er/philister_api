import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagEntity } from "./flag.entity";

@Entity({
  name: 'flag-property',
})
export class FlagPropertyEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(
    () => FlagEntity,
    flag => flag.property,
    {onDelete: 'CASCADE'},
  )
  parent: FlagEntity;

  @ManyToOne(
    () => PropertyEntity,
    {onDelete: 'CASCADE'},
  )
  property: PropertyEntity;

}