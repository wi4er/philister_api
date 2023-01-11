import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { UserContactInsertOperation } from "../../operation/user-contact-insert.operation";
import { UserContactUpdateOperation } from "../../operation/user-contact-update.operation";
import { UserContactEntity } from "../../model/user-contact.entity";
import { UserContactMutationSchema } from "../../schema/user-contact/user-contact-mutation.schema";
import { UserContactInputSchema } from "../../schema/user-contact/user-contact-input.schema";
import { FlagEntity } from "../../../flag/model/flag.entity";
import { UserContact2flagEntity } from "../../model/user-contact2flag.entity";

@Resolver(of => UserContactMutationSchema)
export class UserContactMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectRepository(UserContactEntity)
    private contactRepo: Repository<UserContactEntity>,
    @InjectRepository(FlagEntity)
    private flagRepo: Repository<FlagEntity>,
    @InjectRepository(UserContact2flagEntity)
    private contactStringRepo: Repository<UserContact2flagEntity>,
  ) {

  }

  @ResolveField()
  async add(
    @Args('item')
      item: UserContactInputSchema
  ): Promise<UserContactEntity> {
    return new UserContactInsertOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: UserContactInputSchema
  ): Promise<UserContactEntity> {
    return new UserContactUpdateOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async updateFlag(
    @Args('id')
      id: string,
    @Args('flag')
      flag: string
  ): Promise<UserContactEntity> {
    const parent = await this.contactRepo.findOne({ where: { id }, relations: { flag: { flag: true } } });
    const rel = parent.flag.find(item => item.flag.id === flag);

    if (rel) {
      await this.contactStringRepo.delete({id: rel.id});
    } else {
      await Object.assign(new UserContact2flagEntity(), { parent, flag }).save();
    }

    return await this.contactRepo.findOne({ where: { id }, loadRelationIds: true });
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ): Promise<string[]> {
    const result = [];
    const list = await this.contactRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.contactRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
