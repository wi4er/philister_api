import { Module } from '@nestjs/common';
import { DirectoryQueryResolver } from './resolver/directory-query/directory-query.resolver';
import { DirectoryRootResolver } from './resolver/directory-root/directory-root.resolver';
import { DirectoryMutationResolver } from './resolver/directory-mutation/directory-mutation.resolver';
import { DirectoryResolver } from './resolver/directory/directory.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DirectoryEntity } from "./model/directory.entity";
import { DirectoryPropertyEntity } from "./model/directory-property.entity";
import { DirectoryPropertyResolver } from './resolver/directory-property/directory-property.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ DirectoryEntity, DirectoryPropertyEntity ])
  ],
  providers: [DirectoryQueryResolver, DirectoryRootResolver, DirectoryMutationResolver, DirectoryResolver, DirectoryPropertyResolver]
})
export class DirectoryModule {}
