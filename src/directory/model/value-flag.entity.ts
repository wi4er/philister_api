import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { FlagEntity } from "../../flag/model/flag.entity";
import { ValueEntity } from "./value.entity";

@Entity('value-flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class ValueFlagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @VersionColumn()
  version: number;

  @ManyToOne(
    () => ValueEntity,
    lang => lang.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: ValueEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}