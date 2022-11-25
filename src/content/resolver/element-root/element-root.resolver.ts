import { Query, Resolver } from '@nestjs/graphql';
import { ElementQuerySchema } from "../../schema/element-query.schema";
import { SectionQuerySchema } from "../../schema/section-query.schema";
import { BlockQuerySchema } from "../../schema/block-query.schema";

@Resolver()
export class ElementRootResolver {

  @Query(of => ElementQuerySchema, { name: 'element' })
  getElement() {
    return {}
  }

  @Query(of => SectionQuerySchema, { name: 'section' })
  getSection() {
    return {}
  }

  @Query(of => BlockQuerySchema, { name: 'block' })
  getBlock() {
    return {};
  }

}
