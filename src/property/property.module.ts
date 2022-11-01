import { Module } from '@nestjs/common';
import { PropertyResolver } from './resolver/property/property.resolver';
import { PropertyRootResolver } from './resolver/property-root/property-root.resolver';
import { PropertyQueryResolver } from './resolver/property-query/property-query.resolver';
import { PropertyMutationResolver } from './resolver/property-mutation/property-mutation.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertyEntity } from "./model/property.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ PropertyEntity ])
  ],
  providers: [
    PropertyResolver,
    PropertyRootResolver,
    PropertyQueryResolver,
    PropertyMutationResolver
  ]
})
export class PropertyModule {}
