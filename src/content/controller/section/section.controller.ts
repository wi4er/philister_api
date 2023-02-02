import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from '../../model/section.entity';
import { ElementEntity } from '../../model/element.entity';

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
    };
  }

  @Get()
  async getList() {
    const where = {};

    return this.sectionRepo.find({
      where,
      relations: { string: { property: true }, block: true },
    }).then(list => list.map(this.toView));
  }

}
