import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagEntity } from "./flag.entity";

@Entity({
  name: 'flag-flag',
})
export class FlagFlagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => FlagEntity,
    flag => flag.flag,
    {onDelete: 'CASCADE'},
  )
  parent: FlagEntity;

  @ManyToOne(
    () => FlagEntity,
    {onDelete: 'CASCADE'},
  )
  flag: FlagEntity;

}