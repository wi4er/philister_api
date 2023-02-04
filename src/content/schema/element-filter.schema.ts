class ElementFlagFilterSchema {

  eq: [ string ];

}

class ElementValueFilterSchema {

  eq: [ string ];
}

export class ElementFilterSchema {

  flag?: ElementFlagFilterSchema;

  value?: { [key: string]: ElementValueFilterSchema };

}