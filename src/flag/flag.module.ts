import { Module } from '@nestjs/common';
import { FlagRootResolver } from './resolver/flag-root/flag-root.resolver';
import { FlagQueryResolver } from './resolver/flag-query/flag-query.resolver';
import { FlagMutationResolver } from './resolver/flag-mutation/flag-mutation.resolver';
import { FlagResolver } from './resolver/flag/flag.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FlagEntity } from "./model/flag.entity";
import { FlagFlagEntity } from "./model/flag-flag.entity";
import { FlagStringEntity } from "./model/flag-string.entity";
import { FlagStringResolver } from './resolver/flag-string/flag-string.resolver';
import { FlagFlagResolver } from './resolver/flag-flag/flag-flag.resolver';
import { PropertyEntity } from "../property/model/property.entity";
import { LangEntity } from "../lang/model/lang.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FlagEntity, FlagFlagEntity, FlagStringEntity,
      PropertyEntity,
      LangEntity,
    ])
  ],
  providers: [FlagRootResolver, FlagQueryResolver, FlagMutationResolver, FlagResolver, FlagStringResolver, FlagFlagResolver]
})
export class FlagModule {}
