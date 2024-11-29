import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Resident } from './models/resident.model';

@Resolver(() => Resident)
export class ResidentResolver {
    @ResolveField(() => String)
    public id(@Parent() parent: Map<string, Resident>): string {
        const resident = parent[1];
        const { id } = resident;
        return id;
    }

    @ResolveField(() => String)
    public name(@Parent() parent: Map<string, Resident>): string {
        const resident = parent[1];
        const { name } = resident;
        return name;
    }

    @ResolveField(() => String)
    public sensitiveData(@Parent() parent): string {
        // TODO: あとで権限チェックを入れる
        return parent.sensitiveData;
    }
}
