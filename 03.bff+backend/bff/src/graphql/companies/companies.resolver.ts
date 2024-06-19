import { Args, Query, Resolver } from "@nestjs/graphql";
import { Company } from "../company/models/company.model";
import { CompaniesArgs } from "./models/companies.args";
import {
    CompanyEntityControllerService,
    EntityModelCompany,
} from "src/generated";
import { map, Observable } from "rxjs";

@Resolver(() => [Company])
export class CompaniesResolver {
    constructor(
        private readonly companiesService: CompanyEntityControllerService,
    ) {}

    @Query(() => [Company])
    public companies(
        @Args() args: CompaniesArgs,
    ): Observable<EntityModelCompany[]> {
        return this.companiesService.getCollectionResourceCompanyGet1(
            args.page,
            args.size,
            args.sort,
        ).pipe(map((res) => res.data), map((v) => v._embedded.companies));
    }
}
