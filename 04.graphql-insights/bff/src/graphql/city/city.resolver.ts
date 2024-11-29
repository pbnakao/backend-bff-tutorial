import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { City } from './models/city.model';
import { Resident } from '../resident/models/resident.model';

@Resolver(() => City)
export class CityResolver {
    @ResolveField(() => [Resident])
    public residents(@Parent() parent: City): Resident[] {
        const residents = parent.residents

        // 住民単位でデータをグループ化
        // key: residentId, value: ResidentのMapを作成
        const residentMap = new Map<string, Resident>();

        residents.forEach((resident) => {
            const residentId = resident.residentId;

            // 住民をマップに追加（初回のみ）
            if (!residentMap.has(residentId)) {
                residentMap.set(residentId, {
                    id: residentId,
                    name: resident.residentName,
                    sensitiveData: resident.sensitiveData
                });
            }
        })

        return Array.from(residentMap.values());
    }
}
