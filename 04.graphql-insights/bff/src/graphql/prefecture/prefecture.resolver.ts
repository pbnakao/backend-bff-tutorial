import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Prefecture } from './models/prefecture.model';
import { City } from '../city/models/city.model';

@Resolver(() => Prefecture)
export class PrefectureResolver {
    @ResolveField(() => [City])
    public cities(@Parent() parent: Prefecture): City[] {
        const cities = parent.cities;

        // 市区町村単位でデータをグループ化
        // key: cityId, value: CityのMapを作成
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

        return Array.from(cityMap.values());
    }
}
