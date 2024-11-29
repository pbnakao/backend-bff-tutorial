import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Resident } from './models/resident.model';
import { GraphQLError } from 'graphql';

@Resolver(() => Resident)
export class ResidentResolver {
    @ResolveField(() => String)
    public sensitiveData(@Parent() parent: Resident, @Context() context: any): string {
        const { userId } = context;
        if (!this.isAuthorized(userId)) {
            throw new GraphQLError('機密情報を閲覧する権限がありません。');
        }
        return parent.sensitiveData;
    }

    /**
     * 機密情報を閲覧できるユーザーかどうかを判定する
     * @param userId
     * @returns
     */
    private isAuthorized(userId?: string) {
        // userIdが'admin'の場合は、機密情報を閲覧できる
        return userId === 'admin';
    }
}
