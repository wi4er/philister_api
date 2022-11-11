import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';

@Entity({
  name: "user"
})
export class UserGroupEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

}