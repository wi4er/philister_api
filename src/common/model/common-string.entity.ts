import { LangEntity } from "../../lang/model/lang.entity";
import { PropertyEntity } from "../../property/model/property.entity";

export interface CommonStringEntity<ParentEntity> {

  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  version: number;
  string: string;

  parent: ParentEntity;
  property: PropertyEntity;
  lang: LangEntity;

}