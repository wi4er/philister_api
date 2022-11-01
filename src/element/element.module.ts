import { Module } from '@nestjs/common';
import { ElementResolver } from './resolver/element/element.resolver';
import { ElementPropertyResolver } from './resolver/element-property/element-property.resolver';

@Module({
  providers: [ElementResolver, ElementPropertyResolver]
})
export class ElementModule {}
