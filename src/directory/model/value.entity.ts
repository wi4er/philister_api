import {
  BaseEntity, Check,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { DirectoryEntity } from './directory.entity';
import { Value2stringEntity } from './value2string.entity';
import { Value2flagEntity } from './value2flag.entity';
import { WithFlagEntity } from '../../common/model/with-flag.entity';
import { WithStringEntity } from '../../common/model/with-string.entity';

@Entity('directory-value')
@Check('not_empty_id', '"id" > \'\'')
export class ValueEntity extends BaseEntity
  implements WithFlagEntity<ValueEntity>, WithStringEntity<ValueEntity> {

  @PrimaryColumn({
    type: 'varchar',
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
    type => Value2stringEntity,
    string => string.parent,
  )
  string: Value2stringEntity[];

  @ManyToOne(
    type => DirectoryEntity,
    directory => directory.value,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  directory: DirectoryEntity;

  @OneToMany(
    type => Value2flagEntity,
    string => string.parent,
  )
  flag: Value2flagEntity[];

}