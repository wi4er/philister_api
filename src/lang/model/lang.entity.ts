import {
  BaseEntity, Check,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { LangStringEntity } from "./lang-string.entity";
import { LangFlagEntity } from "./lang-flag.entity";

@Entity(
  'lang'
)
@Check('not_empty_id', '"id" > \'\'')
export class LangEntity extends BaseEntity {

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

  @OneToMany(
    type => LangStringEntity,
    string => string.parent,
  )
  string: LangStringEntity[];

  @OneToMany(
    type => LangFlagEntity,
    flag => flag.parent,
  )
  flag: LangFlagEntity[];

}