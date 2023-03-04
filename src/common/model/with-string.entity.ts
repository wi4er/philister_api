import { BaseEntity } from 'typeorm';
import { CommonStringEntity } from './common-string.entity';

export abstract class WithStringEntity<T extends BaseEntity> extends BaseEntity {

  string: CommonStringEntity<T>[];

}