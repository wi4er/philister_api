import { BaseEntity } from "typeorm";

export class WithPropertySchema<T extends BaseEntity> {

  propertyList: T[];

  propertyItem: T;

  propertyString: string;

}