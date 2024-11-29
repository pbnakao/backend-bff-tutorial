import { Module } from "@nestjs/common";
import { ResidentModule } from './resident/resident.module';
import { CityModule } from './city/city.module';
import { PrefectureModule } from './prefecture/prefecture.module';
import { PrefecturesModule } from './prefectures/prefectures.module';

@Module({
  imports: [ResidentModule, CityModule, PrefectureModule, PrefecturesModule],
})
export class GraphqlModule { }
