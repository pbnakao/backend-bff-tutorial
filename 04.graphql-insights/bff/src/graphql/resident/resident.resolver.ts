import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Resident } from './models/resident.model';

@Resolver(() => Resident)
export class ResidentResolver {
    @ResolveField(() => String)
    public sensitiveData(@Parent() parent: Resident): string {
        // TODO: あとで権限チェックを入れる
        return parent.sensitiveData;
    }
}
