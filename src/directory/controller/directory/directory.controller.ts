import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { DirectoryEntity } from "../../model/directory.entity";
import { EntityManager, Repository } from "typeorm";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryInsertOperation } from "../../operation/directory-insert.operation";
import { DirectoryUpdateOperation } from "../../operation/directory-update.operation";

@Controller('directory')
export class DirectoryController {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
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
    return new DirectoryInsertOperation(input).save(this.entityManager);
  }

  @Put()
  updateItem(
    @Body()
      input: DirectoryInputSchema
  ) {
    return new DirectoryUpdateOperation(input).save(this.entityManager);
  }

  @Delete()
  deleteItem() {

  }

}
