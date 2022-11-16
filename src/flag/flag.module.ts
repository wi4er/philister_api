import { Module } from '@nestjs/common';
import { FlagRootResolver } from './resolver/flag-root/flag-root.resolver';
import { FlagQueryResolver } from './resolver/flag-query/flag-query.resolver';
import { FlagMutationResolver } from './resolver/flag-mutation/flag-mutation.resolver';
import { FlagResolver } from './resolver/flag/flag.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FlagEntity } from "./model/flag.entity";
import { FlagFlagEntity } from "./model/flag-flag.entity";
import { FlagPropertyEntity } from "./model/flag-property.entity";
import { FlagPropertyResolver } from './resolver/flag-property/flag-property.resolver';
import { FlagFlagResolver } from './resolver/flag-flag/flag-flag.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ FlagEntity, FlagFlagEntity, FlagPropertyEntity ])
  ],
  providers: [FlagRootResolver, FlagQueryResolver, FlagMutationResolver, FlagResolver, FlagPropertyResolver, FlagFlagResolver]
})
export class FlagModule {}
