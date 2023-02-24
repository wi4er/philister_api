import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertyEntity } from '../../model/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LangEntity } from '../../../lang/model/lang.entity';
import { PropertyStringSchema } from '../../schema/property-string.schema';

@Resolver(of => PropertyStringSchema)
export class Property2stringResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {
  }

  @ResolveField()
  async property(
    @Parent()
      current: { property: string },
  ) {
    return await this.propertyRepo.findOne({
      where: { id: current.property },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async lang(
    @Parent()
      current: { lang: string },
  ) {
    if (!current.lang) {
      return null;
    }

    return this.langRepo.findOne({
      where: { id: current.lang },
      loadRelationIds: true,
    });
  }

}
