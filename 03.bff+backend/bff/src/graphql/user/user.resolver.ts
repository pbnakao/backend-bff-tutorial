import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { User } from "./models/user.model";
import {
    CompanyEntityControllerService,
    EntityModelAppUser,
    EntityModelCompany,
} from "src/generated";
import { Company } from "src/graphql/company/models/company.model";
import { map, Observable } from "rxjs";

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly companyService: CompanyEntityControllerService,
    ) {}

    @ResolveField(() => String)
    public id(@Parent() parent: EntityModelAppUser): string {
        return parent.userId;
    }

    @ResolveField(() => String)
    public name(@Parent() parent: EntityModelAppUser): string {
        return `${parent.lastName} ${parent.firstName}`;
    }

    @ResolveField(() => Company)
    public company(
        @Parent() parent: EntityModelAppUser,
    ): Observable<EntityModelCompany> {
        return this.companyService.getItemResourceCompanyGet(
            parent.companyCode,
        ).pipe(map((res) => res.data));
    }
}
