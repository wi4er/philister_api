import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserEntity } from "./user.entity";

@Entity({
  name: 'user-flag'
})
export class UserFlagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => UserEntity,
    user => user.flag,
    {onDelete: 'CASCADE'},
  )
  parent: UserEntity;

  @ManyToOne(
    () => FlagEntity,
    {onDelete: 'CASCADE'},
  )
  flag: FlagEntity;

}