class ElementFlagFilterSchema {

  eq: [ string ];

}

class ElementValueFilterSchema {

  eq: [ string ];

}

class ElementStringFilterSchema {

  eq: [ string ];

}


export class ElementFilterSchema {

  flag?: ElementFlagFilterSchema;

  value?: { [key: string]: ElementValueFilterSchema };

  string?: ElementStringFilterSchema;

}