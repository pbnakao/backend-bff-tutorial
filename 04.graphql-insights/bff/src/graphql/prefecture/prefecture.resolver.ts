import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Prefecture } from './models/prefecture.model';
import { City } from '../city/models/city.model';

@Resolver(() => Prefecture)
export class PrefectureResolver {
    @ResolveField(() => String)
    public id(@Parent() parent): string {
        return parent.prefectureId;
    }

    @ResolveField(() => String)
    public name(@Parent() parent): string {
        return parent.prefectureName;
    }

    @ResolveField(() => [City])
    public cities(@Parent() parent) {
        return parent.cities;
    }
}
