import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PropertyEntity } from '../../property/model/property.entity';

@Entity('user-string')
export class UserStringEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  string: string;

  @ManyToOne(
    () => UserEntity,
    user => user.string,
    { onDelete: 'CASCADE' },
  )
  parent: UserEntity

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}