import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementEntity } from '../../model/element.entity';
import { ApiTags } from '@nestjs/swagger';
import { ElementFilterSchema } from '../../schema/element-filter.schema';

@ApiTags('Content')
@Controller('element')
export class ElementController {

  constructor(
    @InjectRepository(ElementEntity)
    private elementRepo: Repository<ElementEntity>,
  ) {
  }

  toView(item: ElementEntity) {
    return {
      id: item.id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      version: item.version,
      property: [
        ...item.string.map(str => ({
          string: str.string,
          property: str.property.id,
          lang: str.lang,
        })),
        ...item.value.map(val => ({
          property: val.property.id,
          value: val.value.id,
          directory: val.value.directory.id,
        })),
      ],
      flag: item.flag.map(fl => fl.flag.id),
    };
  }

  @Get()
  async getList(
    @Query('filter')
      filter?: ElementFilterSchema,
  ) {
    const where = {};

    if (filter?.flag) {
      where['flag'] = { flag: { id: filter.flag.eq } };
    }

    return this.elementRepo.find({
      where,
      relations: {
        string: { property: true },
        flag: { flag: true },
        value: { value: { directory: true }, property: true },
      },
    }).then(list => list.map(this.toView));
  }

}
