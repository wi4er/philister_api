import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

@Injectable()
export class LangService {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  createInsertOperation() {
    console.log(this.entityManager)
  }

}
