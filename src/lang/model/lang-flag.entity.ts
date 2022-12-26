import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { LangEntity } from "./lang.entity";
import { FlagEntity } from "../../flag/model/flag.entity";

@Entity('lang-flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class LangFlagEntity extends BaseEntity {

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
    () => LangEntity,
    lang => lang.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: LangEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}