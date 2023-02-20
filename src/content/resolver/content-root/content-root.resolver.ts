import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ElementQuerySchema } from '../../schema/element-query.schema';
import { SectionQuerySchema } from '../../schema/section-query.schema';
import { BlockQuerySchema } from '../../schema/block-query.schema';
import { BlockMutationSchema } from '../../schema/block-mutation.schema';
import { ElementMutationSchema } from '../../schema/element-mutation.schema';
import { SectionMutationSchema } from '../../schema/section-mutation.schema';

@Resolver()
export class ContentRootResolver {

  @Query(of => ElementQuerySchema, { name: 'element' })
  getElement() {
    return {};
  }

  @Mutation(of => ElementMutationSchema, { name: 'element' })
  setElement() {
    return {};
  }

  @Query(of => SectionQuerySchema, { name: 'section' })
  getSection() {
    return {};
  }

  @Mutation(of => SectionMutationSchema, { name: 'section' })
  setSection() {
    return {};
  }

  @Query(of => BlockQuerySchema, { name: 'block' })
  getBlock() {
    return {};
  }

  @Mutation(of => BlockMutationSchema, { name: 'block' })
  setBlock() {
    return {};
  }

}
