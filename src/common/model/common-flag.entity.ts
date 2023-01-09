import { FlagEntity } from "../../flag/model/flag.entity";
import { BaseEntity } from "typeorm";

export class CommonFlagEntity<T extends BaseEntity> {

  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  version: number;
  parent: T;
  flag: FlagEntity;

}