import { BaseEntity } from "typeorm";
import { CommonFlagEntity } from "./common-flag.entity";

export abstract class WithFlagEntity<T extends BaseEntity>  {

  flag: CommonFlagEntity<T>[];

}