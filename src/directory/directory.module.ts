import { Module } from '@nestjs/common';
import { DirectoryQueryResolver } from './resolver/directory-query/directory-query.resolver';
import { DirectoryRootResolver } from './resolver/directory-root/directory-root.resolver';
import { DirectoryMutationResolver } from './resolver/directory-mutation/directory-mutation.resolver';
import { DirectoryResolver } from './resolver/directory/directory.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DirectoryEntity } from "./model/directory.entity";
import { DirectoryStringEntity } from "./model/directory-string.entity";
import { DirectoryStringResolver } from './resolver/directory-string/directory-string.resolver';
import { ValueEntity } from "./model/value.entity";
import { ValueQueryResolver } from './resolver/value-query/value-query.resolver';
import { ValueMutationResolver } from './resolver/value-mutation/value-mutation.resolver';
import { ValueResolver } from './resolver/value/value.resolver';
import { ValueStringEntity } from "./model/value.string.entity";
import { PropertyEntity } from "../property/model/property.entity";
import { ValueStringResolver } from './resolver/value-string/value-string.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DirectoryEntity, DirectoryStringEntity,
      ValueEntity, ValueStringEntity,
      PropertyEntity,
    ])
  ],
  providers: [
    DirectoryQueryResolver,
    DirectoryRootResolver,
    DirectoryMutationResolver,
    DirectoryResolver,
    DirectoryStringResolver,
    ValueQueryResolver,
    ValueMutationResolver,
    ValueResolver,
    ValueStringResolver
  ]
})
export class DirectoryModule {}
