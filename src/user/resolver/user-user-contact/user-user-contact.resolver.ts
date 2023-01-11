import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserUserContactSchema } from "../../schema/user-user-contact.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserContactEntity } from "../../model/user-contact.entity";

@Resolver(of => UserUserContactSchema)
export class UserUserContactResolver {

  constructor(
    @InjectRepository(UserContactEntity)
    private contactRepo: Repository<UserContactEntity>,
  ) {
  }

  @ResolveField()
  async contact(
    @Parent()
      current: { contact: string }
  ) {
    return this.contactRepo.findOne({
      where: { id: current.contact },
      loadRelationIds: true,
    });
  }

}
