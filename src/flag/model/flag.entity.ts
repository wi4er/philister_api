import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { FlagStringEntity } from "./flag-string.entity";
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
    type => FlagStringEntity,
    property => property.parent,
  )
  string: FlagStringEntity[];

  @OneToMany(
    type => FlagFlagEntity,
    flag => flag.parent,
  )
  flag: FlagFlagEntity[];

}