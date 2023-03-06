import {
  BaseEntity, Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { BlockEntity } from './block.entity';
import { UserGroupEntity } from '../../user/model/user-group.entity';
import { PermissionMethod } from '../../permission/model/permission-method';

@Entity('content-block-permission')
export class BlockPermissionEntity extends BaseEntity {

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

  @ManyToOne(
    type => BlockEntity,
    block => block.permission,
    {
      cascade: true,
      nullable: false,
    }
  )
  block: BlockEntity;

  @ManyToOne(
    type => UserGroupEntity,
    {
      cascade: true,
      nullable: false,
    }
  )
  group: UserGroupEntity;

  @Column({
    type: 'enum',
    enum: PermissionMethod,
    nullable: false,
  })
  method: PermissionMethod;

}