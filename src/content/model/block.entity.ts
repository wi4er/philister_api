import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn, VersionColumn,
} from 'typeorm';
import { ElementEntity } from './element.entity';
import { SectionEntity } from './section.entity';
import { Block2stringEntity } from './block2string.entity';
import { Block2flagEntity } from './block2flag.entity';
import { BlockPermissionEntity } from './block-permission.entity';

@Entity('content-block')
export class BlockEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @VersionColumn()
  version: number;

  @OneToMany(
    type => BlockPermissionEntity,
    permission => permission.block,
  )
  permission: BlockPermissionEntity[];

  @OneToMany(
    type => ElementEntity,
    element => element.block,
  )
  element: ElementEntity;

  @OneToMany(
    type => SectionEntity,
    section => section.block,
  )
  section: SectionEntity;

  @OneToMany(
    type => Block2stringEntity,
    property => property.parent,
  )
  string: Block2stringEntity[];

  @OneToMany(
    type => Block2flagEntity,
    flag => flag.parent,
  )
  flag: Block2flagEntity[];

}