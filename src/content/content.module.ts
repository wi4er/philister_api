import { Module } from '@nestjs/common';
import { BlockResolver } from './resolver/block/block.resolver';
import { SectionResolver } from './resolver/section/section.resolver';
import { ElementPropertyResolver } from './resolver/element-property/element-property.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ElementEntity } from "./model/element.entity";
import { ElementSectionEntity } from "./model/element-section.entity";
import { SectionEntity } from "./model/section.entity";
import { ElementStringEntity } from "./model/element-string.entity";
import { BlockEntity } from "./model/block.entity";
import { BlockStringEntity } from "./model/block-string.entity";
import { ElementValueEntity } from "./model/element-value.entity";
import { SectionValueEntity } from "./model/section-value.entity";
import { SectionStringEntity } from "./model/section-string.entity";
import { ElementElementEntity } from "./model/element-element.entity";
import { ContentRootResolver } from './resolver/content-root/content-root.resolver';
import { ElementQueryResolver } from './resolver/element-query/element-query.resolver';
import { SectionQueryResolver } from './resolver/section-query/section-query.resolver';
import { SectionMutationResolver } from './resolver/section-mutation/section-mutation.resolver';
import { ElementMutationResolver } from './resolver/element-mutation/element-mutation.resolver';
import { BlockQueryResolver } from './resolver/block-query/block-query.resolver';
import { BlockMutationResolver } from './resolver/block-mutation/block-mutation.resolver';
import { ElementResolver } from './resolver/element/element.resolver';
import { BlockStringResolver } from './resolver/block-string/block-string.resolver';
import { PropertyEntity } from "../property/model/property.entity";
import { ContentResolver } from './resolver/content/content.resolver';
import { LangEntity } from "../lang/model/lang.entity";
import { BlockController } from './controller/block/block.controller';
import { ElementController } from './controller/element/element.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ElementEntity, ElementSectionEntity, ElementStringEntity, ElementValueEntity, ElementElementEntity,
      SectionEntity, SectionValueEntity, SectionStringEntity,
      BlockEntity, BlockStringEntity,
      PropertyEntity,
      LangEntity,
    ])
  ],
  providers: [
    ElementResolver, ElementPropertyResolver, ContentRootResolver, ElementQueryResolver,
    SectionQueryResolver, SectionMutationResolver,
    ElementMutationResolver, BlockQueryResolver, BlockMutationResolver, SectionResolver,
    BlockResolver, BlockStringResolver, ContentResolver,
  ],
  controllers: [BlockController, ElementController]
})
export class ContentModule {
}
