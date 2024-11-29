import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Resident } from './models/resident.model';

@Resolver(() => Resident)
export class ResidentResolver {
    @ResolveField(() => String)
    public id(@Parent() parent): string {
        return parent.residentId;
    }

    @ResolveField(() => String)
    public name(@Parent() parent): string {
        return parent.residentName;
    }

    @ResolveField(() => String)
    public sensitiveData(@Parent() parent): string {
        // TODO: あとで権限チェックを入れる
        return parent.sensitiveData;
    }
}
