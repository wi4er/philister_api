import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementEntity } from '../../model/element.entity';
import { ApiTags } from '@nestjs/swagger';
import { ElementFilterSchema } from '../../schema/element-filter.schema';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

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

  toWhere(filter: ElementFilterSchema): FindOptionsWhere<ElementEntity> {
    const where = {};

    if (filter?.flag) {
      where['flag'] = { flag: { id: filter.flag.eq } };
    }

    for (const key in filter?.value) {
      where['value'] = {
        value: { directory: { id: key}, id: filter.value[key].eq },
      };
    }

    return where;
  }

  @Get()
  async getList(
    @Query('filter')
      filter?: ElementFilterSchema,
  ) {
    return this.elementRepo.find({
      where: filter ? this.toWhere(filter) : null,
      relations: {
        string: { property: true },
        flag: { flag: true },
        value: { value: { directory: true }, property: true },
      },
    }).then(list => list.map(this.toView));
  }

}
