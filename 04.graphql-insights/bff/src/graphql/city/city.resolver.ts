import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { City } from './models/city.model';
import { Resident } from '../resident/models/resident.model';

@Resolver(() => City)
export class CityResolver {
    @ResolveField(() => String)
    public id(@Parent() parent): string {
        return parent.cityId;
    }

    @ResolveField(() => String)
    public name(@Parent() parent): string {
        return parent.cityName;
    }

    @ResolveField(() => [Resident])
    public residents(@Parent() parent) {
        return parent.residents;
    }
}
