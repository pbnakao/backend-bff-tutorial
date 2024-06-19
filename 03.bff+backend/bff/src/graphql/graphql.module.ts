import { Module } from "@nestjs/common";
import { CompaniesResolver } from "./companies/companies.resolver";
import { CompanyResolver } from "./company/company.resolver";
import { UserResolver } from "./user/user.resolver";
import { UsersResolver } from "./users/users.resolver";

@Module({
  providers: [CompaniesResolver, CompanyResolver, UsersResolver, UserResolver],
})
export class GraphqlModule {}
