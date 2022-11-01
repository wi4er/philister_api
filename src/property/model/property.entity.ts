import { ObjectType } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "property"
})
export class PropertyEntity {

  @PrimaryGeneratedColumn()
  id: string

}