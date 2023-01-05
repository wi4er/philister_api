import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContactEntity } from '../../model/user-contact.entity';
import { UserContactQuerySchema } from "../../schema/user-contact/user-contact-query.schema";

@Resolver(of => UserContactQuerySchema)
export class UserContactQueryResolver {

  constructor(
    @InjectRepository(UserContactEntity)
    private contactRepo: Repository<UserContactEntity>,
  ) {
  }

  @ResolveField()
  list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ): Promise<UserContactEntity[]> {
    return this.contactRepo.find({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField()
  count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ): Promise<number> {
    return this.contactRepo.count({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField()
  item(
    @Args('id', { type: () => String })
      id: string
  ): Promise<UserContactEntity> {
    return this.contactRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

}
