import { Module } from '@nestjs/common';
import { CityResolver } from './city.resolver';

@Module({
  providers: [CityResolver]
})
export class CityModule {}
