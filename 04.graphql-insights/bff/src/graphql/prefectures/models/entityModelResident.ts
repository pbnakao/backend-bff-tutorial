export interface EntityModelResident {
    residentId: string;
    residentName: string;
    cityId: string;
    cityName: string;
    prefectureId: string;
    prefectureName: string;
    sensitiveData?: string | null;
}