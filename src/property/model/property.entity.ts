import {
  BaseEntity,
  Check,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { Property2stringEntity } from './property2string.entity';
import { Property2flagEntity } from './property2flag.entity';

@Entity('property')
@Check('not_empty_id', '"id" > \'\'')
export class PropertyEntity extends BaseEntity {

  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => Property2stringEntity,
    propertyProperty => propertyProperty.parent,
  )
  string: Property2stringEntity[];

  @OneToMany(
    type => Property2flagEntity,
    flag => flag.parent,
  )
  flag: Property2flagEntity[];

}
