import { BaseEntity, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ValueEntity } from '../../directory/model/value.entity';
import { PropertyEntity } from '../../property/model/property.entity';

@Entity({
  name: 'user-value'
})
@Index([ 'value', 'property', 'parent' ], {unique: true})
export class UserValueEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ValueEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  value: ValueEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.value,
    { onDelete: 'CASCADE' },
  )
  parent: UserEntity;

  @ManyToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  property: PropertyEntity;

}