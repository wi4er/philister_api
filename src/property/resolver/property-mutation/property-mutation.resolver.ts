import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertyMutationSchema } from '../../schema/property-mutation.schema';
import { PropertyEntity } from '../../model/property.entity';
import { PropertyInputSchema } from '../../schema/property-input.schema';
import { PropertyService } from '../../service/property/property.service';

@Resolver(of => PropertyMutationSchema)
export class PropertyMutationResolver {

  constructor(
    private propertyService: PropertyService,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: PropertyInputSchema,
  ): Promise<PropertyEntity> {
    return this.propertyService.insert(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: PropertyInputSchema,
  ): Promise<PropertyEntity> {
    return this.propertyService.update(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[],
  ) {
    return this.propertyService.delete(id);
  }

}
