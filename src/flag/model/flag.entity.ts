import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn
} from "typeorm";
import { FlagStringEntity } from "./flag-string.entity";
import { FlagFlagEntity } from "./flag-flag.entity";

@Entity('flag')
export class FlagEntity extends BaseEntity {

  @PrimaryColumn({
    type: "varchar",
    length: 50,
  })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @VersionColumn()
  version: number;

  @Column({
    nullable: true,
  })
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