import { Module } from '@nestjs/common';
import { ChangeLogQueryResolver } from './resolver/change-log-query/change-log-query.resolver';
import { FetchLogQueryResolver } from './resolver/fetch-log-query/fetch-log-query.resolver';
import { FetchLogResolver } from './resolver/fetch-log/fetch-log.resolver';
import { ChangeLogResolver } from './resolver/change-log/change-log.resolver';
import { LogRootResolver } from './resolver/log-root/log-root.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChangeLogEntity } from "./model/change-log.entity";
import { FetchLogEntity } from "./model/fetch-log.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChangeLogEntity, FetchLogEntity,
    ])
  ],
  providers: [LogRootResolver, ChangeLogQueryResolver, FetchLogQueryResolver, FetchLogResolver, ChangeLogResolver]
})
export class LogModule {}
