import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryService } from '../../service/directory/directory.service';

@Resolver(of => DirectoryMutationSchema)
export class DirectoryMutationResolver {

  constructor(
    private directoryService: DirectoryService,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: DirectoryInputSchema,
  ): Promise<DirectoryEntity> {
    return this.directoryService.insert(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: DirectoryInputSchema,
  ): Promise<DirectoryEntity> {
    return this.directoryService.update(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[],
  ): Promise<string[]> {
    return this.directoryService.delete(id);
  }

}
