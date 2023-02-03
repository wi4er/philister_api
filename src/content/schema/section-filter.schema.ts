class SectionFlagFilterSchema {

  eq: [ string ];

}

export class SectionFilterSchema {

  flag?: SectionFlagFilterSchema;

}