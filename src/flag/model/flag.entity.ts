import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { FlagPropertyEntity } from "./flag-property.entity";
import { FlagFlagEntity } from "./flag-flag.entity";

@Entity({
  name: 'flag'
})
export class FlagEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar"
  })
  id: string;

  @Column()
  label: string;

  @OneToMany(
    type => FlagPropertyEntity,
    property => property.parent,
  )
  property: FlagPropertyEntity[];

  @OneToMany(
    type => FlagFlagEntity,
    flag => flag.parent,
  )
  flag: FlagFlagEntity[];

}