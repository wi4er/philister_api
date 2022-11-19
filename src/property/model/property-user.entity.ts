import { BaseEntity, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { PropertyEntity } from "./property.entity";
import { UserGroupEntity } from "../../user/model/user-group.entity";

@Entity({
  name: 'property-user'
})
export class PropertyUserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => PropertyEntity,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn()
  property: PropertyEntity;

  @ManyToOne(
    () => UserGroupEntity,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  group: UserGroupEntity;

}