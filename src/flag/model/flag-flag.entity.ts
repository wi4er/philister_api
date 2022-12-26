import { BaseEntity, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FlagEntity } from "./flag.entity";

@Entity('flag-flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class FlagFlagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => FlagEntity,
    flag => flag.flag,
    {
      onDelete: 'CASCADE'
    },
  )
  parent: FlagEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}