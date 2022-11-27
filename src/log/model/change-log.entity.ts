import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from "../../user/model/user.entity";

@Entity('log-change')
export class ChangeLogEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  entity: string;

  @Column()
  entityId: string;

  @Column()
  field: string;

  @Column()
  value: string;

  @ManyToOne(
    type => UserEntity,
    { onDelete: 'CASCADE' },
  )
  user: UserEntity;

}