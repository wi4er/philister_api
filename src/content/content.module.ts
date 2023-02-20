import { Module } from '@nestjs/common';
import { BlockResolver } from './resolver/block/block.resolver';
import { SectionResolver } from './resolver/section/section.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElementEntity } from './model/element.entity';
import { Element2sectionEntity } from './model/element2section.entity';
import { SectionEntity } from './model/section.entity';
import { Element2stringEntity } from './model/element2string.entity';
import { BlockEntity } from './model/block.entity';
import { Block2stringEntity } from './model/block2string.entity';
import { Element2valueEntity } from './model/element2value.entity';
import { Section2valueEntity } from './model/section2value.entity';
import { Section2stringEntity } from './model/section2string.entity';
import { Element2elementEntity } from './model/element2element.entity';
import { ContentRootResolver } from './resolver/content-root/content-root.resolver';
import { ElementQueryResolver } from './resolver/element-query/element-query.resolver';
import { SectionQueryResolver } from './resolver/section-query/section-query.resolver';
import { SectionMutationResolver } from './resolver/section-mutation/section-mutation.resolver';
import { ElementMutationResolver } from './resolver/element-mutation/element-mutation.resolver';
import { BlockQueryResolver } from './resolver/block-query/block-query.resolver';
import { BlockMutationResolver } from './resolver/block-mutation/block-mutation.resolver';
import { ElementResolver } from './resolver/element/element.resolver';
import { BlockStringResolver } from './resolver/block-string/block-string.resolver';
import { PropertyEntity } from '../property/model/property.entity';
import { ContentResolver } from './resolver/content/content.resolver';
import { LangEntity } from '../lang/model/lang.entity';
import { BlockController } from './controller/block/block.controller';
import { ElementController } from './controller/element/element.controller';
import { Element2flagEntity } from './model/element2flag.entity';
import { SectionController } from './controller/section/section.controller';
import { Section2flagEntity } from './model/section2flag.entity';
import { Block2flagEntity } from './model/block2flag.entity';
import { ElementStringResolver } from './resolver/element-string/element-string.resolver';
import { SectionStringResolver } from './resolver/section-string/section-string.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ElementEntity, Element2sectionEntity, Element2stringEntity, Element2valueEntity, Element2elementEntity,
      Element2flagEntity,
      SectionEntity, Section2valueEntity, Section2stringEntity, Section2flagEntity,
      BlockEntity, Block2stringEntity, Block2flagEntity,
      PropertyEntity,
      LangEntity,
    ]),
  ],
  providers: [
    ElementResolver, ContentRootResolver, ElementQueryResolver,
    SectionQueryResolver, SectionMutationResolver,
    ElementMutationResolver, BlockQueryResolver, BlockMutationResolver, SectionResolver,
    BlockResolver, BlockStringResolver, ContentResolver, ElementStringResolver, SectionStringResolver,
  ],
  controllers: [ BlockController, ElementController, SectionController ],
})
export class ContentModule {
}
