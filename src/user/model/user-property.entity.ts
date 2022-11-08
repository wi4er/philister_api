import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PropertyEntity } from "../../property/model/property.entity";

@Entity("user-property")
export class UserPropertyEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  value: string

  @ManyToOne(
    () => UserEntity,
    user => user.property,
    {onDelete: "CASCADE"}
  )
  user: UserEntity

  @ManyToOne(
    () => PropertyEntity,
    {onDelete: "CASCADE"}
  )
  property: PropertyEntity

}