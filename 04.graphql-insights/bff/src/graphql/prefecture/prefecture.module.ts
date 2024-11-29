import { Module } from '@nestjs/common';
import { PrefectureResolver } from './prefecture.resolver';

@Module({
  providers: [PrefectureResolver]
})
export class PrefectureModule {}
