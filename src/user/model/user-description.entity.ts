import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PropertyEntity } from '../../property/model/property.entity';

@Entity('user-description')
export class UserDescriptionEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text'
  })
  string: string;

  @ManyToOne(
    () => UserEntity,
    user => user.description,
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
  property: PropertyEntity

}