import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { UserPropertyEntity } from "./user-property.entity";

@Entity({
  name: "user"
})
export class UserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  login: string;

  @Column({nullable: true})
  hash: string

  @OneToMany(
    type => UserPropertyEntity,
    userProperty => userProperty.user,
  )
  property: UserPropertyEntity[]
}