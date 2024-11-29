import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import {
    AppUserSearchControllerService,
    EntityModelAppUser,
    EntityModelCompany,
} from "src/generated";
import { Company } from "./models/company.model";
import { User } from "../user/models/user.model";
import { map, Observable } from "rxjs";

@Resolver(() => Company)
export class CompanyResolver {
    constructor(private readonly service: AppUserSearchControllerService) {}

    @ResolveField(() => String)
    public id(@Parent() parent: EntityModelCompany): string {
        return parent.companyId;
    }

    @ResolveField(() => String)
    public name(@Parent() parent: EntityModelCompany): string {
        return parent.companyName;
    }

    @ResolveField(() => [User])
    public users(
        @Parent() parent: EntityModelCompany,
    ): Observable<EntityModelAppUser[]> {
        return this.service.executeSearchAppuserGet(parent.companyId).pipe(
            map((res) => res.data),
            map((v) => v._embedded.appUsers),
        );
    }
}
