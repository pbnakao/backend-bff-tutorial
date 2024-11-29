import { Args, Query, Resolver } from '@nestjs/graphql';
import { Prefecture } from '../prefecture/models/prefecture.model';
import { PrefecturesArgs } from './models/prefectures.args';

@Resolver(() => [Prefecture])
export class PrefecturesResolver {
    @Query(() => [Prefecture])
    public prefectures(@Args() args: PrefecturesArgs) {
        return null;
    }
}
