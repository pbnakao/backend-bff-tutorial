import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "../user/models/user.model";
import {
    AppUserEntityControllerService,
    EntityModelAppUser,
} from "src/generated";
import { map, Observable } from "rxjs";
import { UserArgs } from "./models/users.args";

@Resolver()
export class UsersResolver {
    constructor(private readonly userService: AppUserEntityControllerService) {}
    @Query(() => [User])
    public users(@Args() args: UserArgs): Observable<EntityModelAppUser[]> {
        return this.userService.getCollectionResourceAppuserGet1(
            args.page,
            args.size,
            args.sort,
        ).pipe(
            map((res) => res.data),
            map((v) => v._embedded.appUsers),
        );
    }

    @Query(() => User, { nullable: true })
    public findUserById(
        @Args("id") id: string,
    ): Observable<EntityModelAppUser> {
        return this.userService.getItemResourceAppuserGet(id).pipe(
            map((res) => res.data),
        );
    }
}
