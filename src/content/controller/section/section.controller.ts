import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from '../../model/section.entity';
import { SectionFilterSchema } from '../../schema/section-filter.schema';

@Controller('section')
export class SectionController {

  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepo: Repository<SectionEntity>,
  ) {
  }

  toView(item: SectionEntity) {
    return {
      id: item.id,
      block: item.block.id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      version: item.version,
      property: [
        ...item.string.map(str => ({
          string: str.string,
          property: str.property.id,
          lang: str.lang,
        })),
      ],
      flag: item.flag.map(fl => fl.flag.id),
    };
  }

  @Get()
  async getList(
    @Query('filter')
      filter?: SectionFilterSchema,
  ) {
    const where = {};

    if (filter?.flag) {
      where['flag'] = { flag: { id: filter.flag.eq } };
    }

    return this.sectionRepo.find({
      where,
      relations: { string: { property: true }, block: true, flag: { flag: true } },
    }).then(list => list.map(this.toView));
  }

}
