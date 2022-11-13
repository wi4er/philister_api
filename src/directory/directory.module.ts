import { Module } from '@nestjs/common';
import { DirectoryQueryResolver } from './resolver/directory-query/directory-query.resolver';
import { DirectoryRootResolver } from './resolver/directory-root/directory-root.resolver';
import { DirectoryMutationResolver } from './resolver/directory-mutation/directory-mutation.resolver';
import { DirectoryResolver } from './resolver/directory/directory.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DirectoryEntity } from "./model/directory.entity";
import { DirectoryPropertyEntity } from "./model/directory-property.entity";
import { DirectoryPropertyResolver } from './resolver/directory-property/directory-property.resolver';
import { ValueEntity } from "./model/value.entity";
import { ValueQueryResolver } from './resolver/value-query/value-query.resolver';
import { ValueMutationResolver } from './resolver/value-mutation/value-mutation.resolver';
import { ValueResolver } from './resolver/value/value.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ DirectoryEntity, DirectoryPropertyEntity, ValueEntity ])
  ],
  providers: [DirectoryQueryResolver, DirectoryRootResolver, DirectoryMutationResolver, DirectoryResolver, DirectoryPropertyResolver, ValueQueryResolver, ValueMutationResolver, ValueResolver]
})
export class DirectoryModule {}
