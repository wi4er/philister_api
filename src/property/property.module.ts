import { Module } from '@nestjs/common';
import { PropertyResolver } from './resolver/property/property.resolver';
import { PropertyRootResolver } from './resolver/property-root/property-root.resolver';
import { PropertyQueryResolver } from './resolver/property-query/property-query.resolver';
import { PropertyMutationResolver } from './resolver/property-mutation/property-mutation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './model/property.entity';
import { Property2stringResolver } from './resolver/property2string/property2string.resolver';
import { Property2stringEntity } from './model/property2string.entity';
import { LogModule } from '../log/log.module';
import { Property2flagEntity } from './model/property2flag.entity';
import { LangEntity } from '../lang/model/lang.entity';
import { PropertyService } from './service/property/property.service';

@Module({
  imports: [
    LogModule,
    TypeOrmModule.forFeature([
      PropertyEntity, Property2stringEntity, Property2flagEntity,
      LangEntity,
    ]),
  ],
  providers: [
    PropertyResolver,
    PropertyRootResolver,
    PropertyQueryResolver,
    PropertyMutationResolver,
    Property2stringResolver,
    PropertyService,
  ],
})
export class PropertyModule {
}
