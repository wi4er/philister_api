import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn
} from 'typeorm';
import { FlagEntity } from "../../flag/model/flag.entity";
import { DirectoryEntity } from "./directory.entity";

@Entity('directory-flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class DirectoryFlagEntity extends BaseEntity {

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
    () => DirectoryEntity,
    lang => lang.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: DirectoryEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}