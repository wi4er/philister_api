import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from "../../user/model/user.entity";

@Entity('log-fetch')
export class FetchLogEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  entity: string;

  @Column()
  operation: string;

  @Column()
  arguments: string;

  @ManyToOne(
    type => UserEntity,
    { onDelete: 'CASCADE' },
  )
  user: UserEntity;

}