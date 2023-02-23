import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { DirectoryEntity } from "../../model/directory.entity";
import { EntityManager, Repository } from "typeorm";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryService } from '../../service/directory/directory.service';

@Controller('directory')
export class DirectoryController {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private directoryService: DirectoryService
  ) {
  }

  @Get()
  async getList(): Promise<DirectoryEntity[]> {
    return this.directoryRepo.find({
      relations: {
        string: {
          lang: true
        },
      }
    });
  }

  @Post()
  async addItem(
    @Body()
      input: DirectoryInputSchema
  ): Promise<DirectoryEntity>  {
    return this.directoryService.insert(input);
  }

  @Put()
  updateItem(
    @Body()
      input: DirectoryInputSchema
  ) {
    return this.directoryService.update(input);
  }

  @Delete()
  deleteItem() {

  }

}
