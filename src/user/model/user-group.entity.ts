import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';

@Entity({
  name: "user-group"
})
export class UserGroupEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

}