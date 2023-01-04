import { Module } from '@nestjs/common';
import { UserRootResolver } from './resolver/user-root/user-root.resolver';
import { UserResolver } from "./resolver/user/user.resolver";
import { UserQueryResolver } from './resolver/user-query/user-query.resolver';
import { UserMutationResolver } from './resolver/user-mutation/user-mutation.resolver';
import { UserGroupResolver } from './resolver/user-group/user-group.resolver';
import { UserGroupMutationResolver } from './resolver/user-group-mutation/user-group-mutation.resolver';
import { UserGroupQueryResolver } from './resolver/user-group-query/user-group-query.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./model/user.entity";
import { UserStringResolver } from './resolver/user-string/user-string.resolver';
import { User2stringEntity } from "./model/user2string.entity";
import { PropertyEntity } from "../property/model/property.entity";
import { AuthMutationResolver } from './resolver/auth-mutation/auth-mutation.resolver';
import { UserService } from './service/user/user.service';
import { EncodeService } from "./service/encode/encode.service";
import { PropertyPropertyEntity } from "../property/model/property-property.entity";
import { UserValueResolver } from './resolver/user-value/user-value.resolver';
import { UserUserResolver } from './resolver/user-user/user-user.resolver';
import { User2userEntity } from "./model/user2user.entity";
import { User2valueEntity } from "./model/user2value.entity";
import { User2flagEntity } from "./model/user2flag.entity";
import { UserController } from './controller/user/user.controller';
import { AuthController } from './controller/auth/auth.controller';
import { SessionService } from './service/session/session.service';
import { ForgotController } from './controller/forgot/forgot.controller';
import { UserContactEntity } from "./model/user-contact.entity";
import { User2userContactEntity } from "./model/user2user-contact.entity";
import { UserContact2flagEntity } from "./model/user-contact2flag.entity";
import { UserContact2stringEntity } from "./model/user-contact2string.entity";
import { UserContactQueryResolver } from './resolver/user-contact-query/user-contact-query.resolver';
import { UserContactMutationResolver } from './resolver/user-contact-mutation/user-contact-mutation.resolver';
import { UserContactResolver } from './resolver/user-contact/user-contact.resolver';
import { UserContactStringResolver } from './resolver/user-contact-string/user-contact-string.resolver';
import { LangEntity } from "../lang/model/lang.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, User2stringEntity, User2userEntity, User2valueEntity, User2flagEntity, User2userContactEntity,
      UserContactEntity, UserContact2flagEntity, UserContact2stringEntity,
      PropertyEntity, PropertyPropertyEntity,
      LangEntity,
    ])
  ],
  providers: [
    UserRootResolver,
    UserResolver,
    UserQueryResolver,
    UserMutationResolver,
    UserGroupResolver,
    UserGroupQueryResolver,
    UserGroupMutationResolver,
    UserStringResolver,
    AuthMutationResolver,
    EncodeService,
    UserService,
    UserValueResolver,
    UserUserResolver,
    SessionService,
    UserContactQueryResolver,
    UserContactMutationResolver,
    UserContactResolver,
    UserContactStringResolver,
  ],
  controllers: [UserController, AuthController, ForgotController]
})
export class UserModule {
}
