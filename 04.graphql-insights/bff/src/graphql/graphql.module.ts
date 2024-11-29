import { Module } from "@nestjs/common";
import { CompaniesResolver } from "./companies/companies.resolver";
import { CompanyResolver } from "./company/company.resolver";
import { UserResolver } from "./user/user.resolver";
import { UsersResolver } from "./users/users.resolver";
import { ResidentModule } from './resident/resident.module';
import { CityModule } from './city/city.module';
import { PrefectureModule } from './prefecture/prefecture.module';
import { PrefecturesModule } from './prefectures/prefectures.module';

@Module({
  providers: [CompaniesResolver, CompanyResolver, UsersResolver, UserResolver],
  imports: [ResidentModule, CityModule, PrefectureModule, PrefecturesModule],
})
export class GraphqlModule {}
