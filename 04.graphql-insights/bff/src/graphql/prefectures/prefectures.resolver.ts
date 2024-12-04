import { Query, Resolver } from '@nestjs/graphql';
import { Prefecture } from '../prefecture/models/prefecture.model';
import { EntityModelResident } from './models/entityModelResident';
import { map, Observable, of } from 'rxjs';

@Resolver(() => [Prefecture])
export class PrefecturesResolver {
    @Query(() => [Prefecture])
    public prefectures(): Observable<Prefecture[]> {
        return this.fetchMockData().pipe(
            map((residents) => {
                // 都道府県単位でデータをグループ化
                // key: prefectureId, value: PrefectureのMapを作成
                const prefectureMap = new Map<string, Prefecture>();

                residents.forEach((resident) => {
                    const prefectureId = resident.prefectureId;

                    // 都道府県をマップに追加（初回のみ）
                    if (!prefectureMap.has(prefectureId)) {
                        prefectureMap.set(prefectureId, {
                            id: prefectureId,
                            name: resident.prefectureName,
                            cities: residents.filter((resident) => resident.prefectureId === prefectureId) // ここではcitiesを解決しない（PrefectureResolverの責務）
                        });
                    }
                })

                return Array.from(prefectureMap.values());
            })
        );
    }

    /**
     * Backend APIを呼び出すメソッドのモック
     * @returns 居住する都道府県、市区町村の情報をもった住民の一覧
     */
    private fetchMockData(): Observable<EntityModelResident[]> {
        return of([
            {
                residentId: "r001",
                residentName: "Taro Yamada",
                cityId: "c001",
                cityName: "Shinjuku",
                prefectureId: "p001",
                prefectureName: "Tokyo",
            },
            {
                residentId: "r002",
                residentName: "Hanako Suzuki",
                cityId: "c001",
                cityName: "Shinjuku",
                prefectureId: "p001",
                prefectureName: "Tokyo",
            },
            {
                residentId: "r003",
                residentName: "Kenji Tanaka",
                cityId: "c002",
                cityName: "Shibuya",
                prefectureId: "p001",
                prefectureName: "Tokyo",
            },
            {
                residentId: "r004",
                residentName: "Mika Sato",
                cityId: "c003",
                cityName: "Umeda",
                prefectureId: "p002",
                prefectureName: "Osaka",
            }
        ]);
    }
}
