import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementEntity } from '../../model/element.entity';
import { ApiTags } from '@nestjs/swagger';

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
      ],
    };
  }

  @Get()
  async getList() {
    return this.elementRepo.find({
      relations: { string: { property: true } },
    }).then(list => list.map(this.toView));
  }

}
