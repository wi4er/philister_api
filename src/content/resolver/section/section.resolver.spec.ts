import { Test } from '@nestjs/testing';
import { SectionResolver } from './section.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { BlockEntity } from '../../model/block.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { SectionEntity } from '../../model/section.entity';
import { Section2flagEntity } from '../../model/section2flag.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';


const sectionItemQuery = gql`
  query GetSectionItem($id: Int!) {
    section {
      item(id: $id) {
        id
        created_at
        updated_at
        flagString
      }
    }
  }
`

describe('SectionResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Section with flag', () => {
    test('Should get section with flag', async () => {
      const block = await new BlockEntity().save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      const parent = await Object.assign(new SectionEntity(), { block }).save();

      await Object.assign(new Section2flagEntity(), { parent, flag }).save();

      const res = await request(app.getHttpServer())
        .query(sectionItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['section']['item']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });
});
