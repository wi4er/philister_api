import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity, ManyToOne } from 'typeorm';
import { UserEntity } from "./user.entity";

@Entity({
  name: "user-group"
})
export class UserGroupEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

}