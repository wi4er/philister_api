import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { LangMutationSchema } from "../../schema/lang-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { LangInputSchema } from "../../schema/lang-input.schema";
import { LangEntity } from "../../model/lang.entity";
import { LangInsertOperation } from "../../operation/lang-insert.operation";
import { LangUpdateOperation } from "../../operation/lang-update.operation";

@Resolver(of => LangMutationSchema)
export class LangMutationResolver {

  constructor(
    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: LangInputSchema
  ): Promise<LangEntity> {
    return new LangInsertOperation(item).save();
  }

  @ResolveField()
  async update(
    @Args('item')
      item: LangInputSchema
  ) {
    return new LangUpdateOperation(item).save();
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
    const result = [];
    const list = await this.langRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.langRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
