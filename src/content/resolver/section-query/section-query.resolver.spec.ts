import { Test } from '@nestjs/testing';
import { SectionQueryResolver } from './section-query.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { BlockEntity } from '../../model/block.entity';
import { SectionEntity } from '../../model/section.entity';

const sectionListQuery = gql`
  query GetSectionList($limit: Int, $offset: Int) {
    section {
      list(limit: $limit, offset: $offset) {
        id
        updated_at
        created_at
        version
        propertyList {
          string
          property {
            id
          }
        }
      }
    }
  }
`;

describe('SectionQueryResolver', () => {
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

  describe('Section list', () => {
    test('Should get empty list', async () => {
      const res = await request(app.getHttpServer())
        .query(sectionListQuery)
        .expectNoErrors();

      expect(res.data['section']['list']).toEqual([]);
    });

    test('Should get section list', async () => {
      const block = await new BlockEntity().save();

      for (let i = 0; i < 10; i++) {
        await Object.assign(new SectionEntity(), { block }).save();
      }

      const res = await request(app.getHttpServer())
        .query(sectionListQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['section']['list']).toHaveLength(10);
    });
  });
});
