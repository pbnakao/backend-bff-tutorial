import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Prefecture } from './models/prefecture.model';
import { City } from '../city/models/city.model';

@Resolver(() => Prefecture)
export class PrefectureResolver {
    @ResolveField(() => String)
    public id(@Parent() parent: Map<string, Prefecture>): string {
        const prefecture = parent[1];
        const { id } = prefecture;
        return id;
    }

    @ResolveField(() => String)
    public name(@Parent() parent: Map<string, Prefecture>): string {
        const prefecture = parent[1];
        const { name } = prefecture;
        return name;
    }

    @ResolveField(() => [City])
    public cities(@Parent() parent: Map<string, Prefecture>) {
        const prefecture = parent[1];
        const { cities } = prefecture;
        const cityMap = new Map<string, City>();

        cities.forEach((city) => {
            const cityId = city.cityId;

            // 市区町村をマップに追加（初回のみ）
            if (!cityMap.has(cityId)) {
                cityMap.set(cityId, {
                    id: cityId,
                    name: city.cityName,
                    residents: cities.filter((city) => city.cityId === cityId) // ここではresidentsを解決しない（CityResolverの責務）
                });
            }
        })

        return cityMap;
    }
}
