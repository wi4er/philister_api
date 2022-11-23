import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { LangMutationSchema } from "../../schema/lang-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LangInputSchema } from "../../schema/lang-input.schema";
import { LangEntity } from "../../model/lang.entity";
import { LangInsertOperation } from "../../operation/lang-insert.operation";

@Resolver(of => LangMutationSchema)
export class LangMutationResolver {

  constructor(
    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {
  }

  @ResolveField('add')
  async add(
    @Args('item')
      item: LangInputSchema
  ): Promise<LangEntity> {
    return new LangInsertOperation(item).save();
  }

  @ResolveField('update')
  async update(
    @Args('item')
      item: LangInputSchema
  ) {
  }

  @ResolveField('delete')
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
  }

}
