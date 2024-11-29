import { Module } from '@nestjs/common';
import { PrefecturesResolver } from './prefectures.resolver';

@Module({
  providers: [PrefecturesResolver]
})
export class PrefecturesModule {}
