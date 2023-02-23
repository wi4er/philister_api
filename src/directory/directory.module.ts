import { Module } from '@nestjs/common';
import { DirectoryQueryResolver } from './resolver/directory-query/directory-query.resolver';
import { DirectoryRootResolver } from './resolver/directory-root/directory-root.resolver';
import { DirectoryMutationResolver } from './resolver/directory-mutation/directory-mutation.resolver';
import { DirectoryResolver } from './resolver/directory/directory.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoryEntity } from './model/directory.entity';
import { Directory2stringEntity } from './model/directory2string.entity';
import { DirectoryStringResolver } from './resolver/directory-string/directory-string.resolver';
import { ValueEntity } from './model/value.entity';
import { ValueQueryResolver } from './resolver/value-query/value-query.resolver';
import { ValueMutationResolver } from './resolver/value-mutation/value-mutation.resolver';
import { ValueResolver } from './resolver/value/value.resolver';
import { Value2stringEntity } from './model/value2string.entity';
import { PropertyEntity } from '../property/model/property.entity';
import { ValueStringResolver } from './resolver/value-string/value-string.resolver';
import { LangEntity } from '../lang/model/lang.entity';
import { Directory2flagEntity } from './model/directory2flag.entity';
import { Value2flagEntity } from './model/value2flag.entity';
import { FlagEntity } from '../flag/model/flag.entity';
import { DirectoryController } from './controller/directory/directory.controller';
import { ValueController } from './controller/value/value.controller';
import { DirectoryService } from './service/directory/directory.service';
import { ValueService } from './service/value/value.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DirectoryEntity, Directory2stringEntity, Directory2flagEntity,
      ValueEntity, Value2stringEntity, Value2flagEntity,
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
    ValueStringResolver,
    DirectoryService,
    ValueService
  ],
  controllers: [DirectoryController, ValueController]
})
export class DirectoryModule {}
