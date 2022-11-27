import { Module } from '@nestjs/common';
import { PropertyResolver } from './resolver/property/property.resolver';
import { PropertyRootResolver } from './resolver/property-root/property-root.resolver';
import { PropertyQueryResolver } from './resolver/property-query/property-query.resolver';
import { PropertyMutationResolver } from './resolver/property-mutation/property-mutation.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertyEntity } from "./model/property.entity";
import { PropertyPropertyResolver } from './resolver/property-property/property-property.resolver';
import { PropertyPropertyEntity } from "./model/property-property.entity";
import { LogModule } from "../log/log.module";

@Module({
  imports: [
    LogModule,
    TypeOrmModule.forFeature([ PropertyEntity, PropertyPropertyEntity ]),
  ],
  providers: [
    PropertyResolver,
    PropertyRootResolver,
    PropertyQueryResolver,
    PropertyMutationResolver,
    PropertyPropertyResolver,
  ],
})
export class PropertyModule {}
