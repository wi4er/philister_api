import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { LangEntity } from "./model/lang.entity";
import { LangStringEntity } from "./model/lang-string.entity";
import { LangFlagEntity } from "./model/lang-flag.entity";
import { LangRootResolver } from './resolver/lang-root/lang-root.resolver';
import { LangQueryResolver } from './resolver/lang-query/lang-query.resolver';
import { LangResolver } from './resolver/lang/lang.resolver';
import { LangStringResolver } from './resolver/lang-string/lang-string.resolver';
import { LangFlagResolver } from './resolver/lang-flag/lang-flag.resolver';
import { PropertyEntity } from "../property/model/property.entity";
import { FlagEntity } from "../flag/model/flag.entity";
import { LangMutationResolver } from './resolver/lang-mutation/lang-mutation.resolver';
import { LangService } from './service/lang/lang.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LangEntity, LangStringEntity, LangFlagEntity,
      PropertyEntity,
      FlagEntity,
    ])
  ],
  providers: [
    LangService,
    LangRootResolver,
    LangQueryResolver,
    LangResolver,
    LangStringResolver,
    LangFlagResolver,
    LangMutationResolver
  ],
  exports: [ LangService ]
})
export class LangModule {
}
