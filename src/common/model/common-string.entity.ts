import { LangEntity } from '../../lang/model/lang.entity';
import { PropertyEntity } from '../../property/model/property.entity';
import { BaseEntity } from 'typeorm';

export interface CommonStringEntity<P extends BaseEntity> {

  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  version: number;
  string: string;

  parent: P;
  property: PropertyEntity;
  lang?: LangEntity;

}