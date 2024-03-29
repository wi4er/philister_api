import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { FlagEntity } from '../../flag/model/flag.entity';
import { SectionEntity } from './section.entity';

@Entity('content-section2flag')
@Index([ 'parent', 'flag' ], { unique: true })
export class Section2flagEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(
    () => SectionEntity,
    section => section.flag,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  parent: SectionEntity;

  @ManyToOne(
    () => FlagEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  flag: FlagEntity;

}