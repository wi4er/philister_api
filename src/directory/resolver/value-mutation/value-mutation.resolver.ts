import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { ValueMutationSchema } from "../../schema/value-mutation.schema";
import { ValueInputSchema } from "../../schema/value-input.schema";
import { ValueService } from '../../service/value/value.service';

@Resolver(of => ValueMutationSchema)
export class ValueMutationResolver {

  constructor(
    private valueService: ValueService,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: ValueInputSchema,
  ) {
    return this.valueService.insert(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: ValueInputSchema,
  ) {
    return this.valueService.update(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[],
  ) {
    return this.valueService.delete(id);
  }

}
