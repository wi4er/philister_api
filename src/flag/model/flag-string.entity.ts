import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagEntity } from "./flag.entity";

@Entity({
  name: 'flag-string',
})
export class FlagStringEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  string: string;

  @ManyToOne(
    () => FlagEntity,
    flag => flag.string,
    {onDelete: 'CASCADE'},
  )
  parent: FlagEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}