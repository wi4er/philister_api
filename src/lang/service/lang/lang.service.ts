import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { LangEntity } from "../../model/lang.entity";
import { Repository } from "typeorm";

@Injectable()
export class LangService {

  constructor(
    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {

  }
}
