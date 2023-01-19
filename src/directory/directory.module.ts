import { Module } from '@nestjs/common';
import { DirectoryQueryResolver } from './resolver/directory-query/directory-query.resolver';
import { DirectoryRootResolver } from './resolver/directory-root/directory-root.resolver';
import { DirectoryMutationResolver } from './resolver/directory-mutation/directory-mutation.resolver';
import { DirectoryResolver } from './resolver/directory/directory.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoryEntity } from './model/directory.entity';
import { DirectoryStringEntity } from './model/directory-string.entity';
import { DirectoryStringResolver } from './resolver/directory-string/directory-string.resolver';
import { ValueEntity } from './model/value.entity';
import { ValueQueryResolver } from './resolver/value-query/value-query.resolver';
import { ValueMutationResolver } from './resolver/value-mutation/value-mutation.resolver';
import { ValueResolver } from './resolver/value/value.resolver';
import { ValueStringEntity } from './model/value.string.entity';
import { PropertyEntity } from '../property/model/property.entity';
import { ValueStringResolver } from './resolver/value-string/value-string.resolver';
import { LangEntity } from '../lang/model/lang.entity';
import { DirectoryFlagEntity } from './model/directory-flag.entity';
import { ValueFlagEntity } from './model/value-flag.entity';
import { FlagEntity } from '../flag/model/flag.entity';
import { DirectoryController } from './controller/directory/directory.controller';
import { ValueController } from './controller/value/value.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DirectoryEntity, DirectoryStringEntity, DirectoryFlagEntity,
      ValueEntity, ValueStringEntity, ValueFlagEntity,
      PropertyEntity,
      LangEntity,
      FlagEntity,
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
  ],
  controllers: [DirectoryController, ValueController]
})
export class DirectoryModule {}
