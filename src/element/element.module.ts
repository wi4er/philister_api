import { Module } from '@nestjs/common';
import { ElementResolver } from './resolver/element/element.resolver';
import { ElementPropertyResolver } from './resolver/element-property/element-property.resolver';
import { ResolverResolver } from './element/resolver/resolver.resolver';

@Module({
  providers: [ElementResolver, ElementPropertyResolver, ResolverResolver]
})
export class ElementModule {}
