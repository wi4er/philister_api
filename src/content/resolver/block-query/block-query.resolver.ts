import { Args, Context, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockQuerySchema } from '../../schema/block-query.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BlockEntity } from '../../model/block.entity';
import { UserEntity } from '../../../user/model/user.entity';
import { PermissionMethod } from '../../../permission/model/permission-method';

@Resolver(of => BlockQuerySchema)
export class BlockQueryResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  async getGroupList(req: Request): Promise<number[]> {
    const id = req['session']?.['user']?.['id'];

    if (!id) {
      return [];
    }

    const user = await this.userRepo.findOne({
      where: { id },
      relations: { group: { group: true } },
    });

    if (!user) {
      return [];
    }

    console.log(user);

    return user.group.map(it => it.group.id);
  }

  @ResolveField('list')
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
    @Context()
      context: { req: Request },
  ) {

    console.log(await this.getGroupList(context.req));
    return this.blockRepo.find({
      where: {
        permission: {
          group: In(await this.getGroupList(context.req)),
          method: In([ PermissionMethod.READ, PermissionMethod.ALL ]),
        },
      },
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField('count')
  async count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
    @Context()
      context: { req: Request },
  ) {
    return this.blockRepo.count({
      where: {
        permission: {
          group: In(await this.getGroupList(context.req)),
          method: In([ PermissionMethod.READ, PermissionMethod.ALL ]),
        },
      },
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('item')
  async item(
    @Args('id', { type: () => Int })
      id: number,
    @Context()
      context: { req: Request },
  ) {
    return this.blockRepo.findOne({
      where: {
        id,
        permission: {
          group: In(await this.getGroupList(context.req)),
          method: In([ PermissionMethod.READ, PermissionMethod.ALL ]),
        },
      },
      loadRelationIds: true,
    });
  }

}
