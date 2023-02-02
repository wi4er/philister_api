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

  @Get()
  async getList() {
    return this.elementRepo.find();
  }

}
