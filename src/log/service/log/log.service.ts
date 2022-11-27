import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { BaseEntity, Repository } from "typeorm";
import { ChangeLogEntity } from "../../model/change-log.entity";
import { FetchLogEntity } from "../../model/fetch-log.entity";

@Injectable()
export class LogService {

  constructor(
    @InjectRepository(ChangeLogEntity)
    private changeRepo: Repository<ChangeLogEntity>,

    @InjectRepository(FetchLogEntity)
    private fetchRepo: Repository<FetchLogEntity>,
  ) {

  }

  async create(entity: string, id: string): Promise<BaseEntity> {
    const inst = new ChangeLogEntity();
    inst.entity = entity;
    inst.entityId = id;
    inst.field = 'id';
    inst.value = id;

    return await inst.save();
  }

  async get(entity: string, operation: string): Promise<BaseEntity> {
    const inst = new FetchLogEntity();
    inst.entity = entity;
    inst.operation = operation;
    inst.arguments = '{}';

    return await inst.save();
  }
}
