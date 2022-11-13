import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyEntity } from "./property.entity";

@Entity({
  name: 'property-property'
})
export class PropertyPropertyEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(
    () => PropertyEntity,
    property => property.property,
    {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    },
  )
  parent: PropertyEntity;

  @ManyToOne(
    () => PropertyEntity,
    {onDelete: 'CASCADE'},
  )
  property: PropertyEntity;

}
