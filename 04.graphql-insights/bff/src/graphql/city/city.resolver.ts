import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { City } from './models/city.model';
import { Resident } from '../resident/models/resident.model';

@Resolver(() => City)
export class CityResolver {
    @ResolveField(() => String)
    public id(@Parent() parent: Map<string, City>): string {
        const city = parent[1];
        const { id } = city;
        return id;
    }

    @ResolveField(() => String)
    public name(@Parent() parent: Map<string, City>): string {
        const city = parent[1];
        const { name } = city;
        return name;
    }

    @ResolveField(() => [Resident])
    public residents(@Parent() parent: Map<string, City>) {
        const city = parent[1];
        const { residents } = city;
        const residentMap = new Map<string, Resident>();

        residents.forEach((resident) => {
            const residentId = resident.residentId;

            // 住民をマップに追加（初回のみ）
            if (!residentMap.has(residentId)) {
                residentMap.set(residentId, {
                    id: residentId,
                    name: resident.residentName,
                });
            }
        })

        return residentMap;
    }
}
