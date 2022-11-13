import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DirectoryEntity } from "./directory.entity";

@Entity({
  name: 'value'
})
export class ValueEntity extends BaseEntity {
  @PrimaryColumn({
    type: "varchar"
  })
  id: string;

  @ManyToOne(
    type => DirectoryEntity,
    directory => directory.value,
    {onDelete: 'CASCADE'},
  )
  directory: DirectoryEntity;
}