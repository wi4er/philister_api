import { Test } from '@nestjs/testing';
import { SectionStringResolver } from './section-string.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { BlockEntity } from '../../model/block.entity';
import { PropertyEntity } from '../../../property/model/property.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { SectionEntity } from '../../model/section.entity';
import { Section2stringEntity } from '../../model/section2string.entity';

const sectionItemQuery = gql`
  query GetSectionItem($id: Int!) {
    section {
      item(id: $id) {
        id
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

describe('SectionStringResolver', () => {
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

  describe('Section with strings', () => {
    test('Should get section with strings', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new SectionEntity(), { block }).save();

      await Object.assign(new Section2stringEntity(), { parent, property, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(sectionItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['section']['item']['propertyList']).toHaveLength(1);
      expect(res.data['section']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['section']['item']['propertyList'][0]['property']['id']).toBe('NAME');
    });
  });
});
