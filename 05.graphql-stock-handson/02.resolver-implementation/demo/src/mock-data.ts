/* src/mock-data.ts
   ─────────────────────────────────────────
   GraphQL ハンズオン用のインメモリデータ
   ───────────────────────────────────────── */

export type ClientRecord = {
    id: string;
    name: string;
    address?: string;
};

export type StockRecord = {
    id: string;
    name: string;
    modelYear: number;
    price: number;
    mileage?: number;
    clientId: string; // FK
};

export type PhotoRecord = {
    id: string;
    stockId: string; // FK
    url: string;
    isMain: boolean;
};

/* ---- Client (販売店) ---- */
export const clients: ClientRecord[] = [
    { id: 'c001', name: '東京店', address: '東京都杉並区…' },
    { id: 'c002', name: '横浜店', address: '神奈川県横浜市…' },
];

/* ---- Stock (在庫車両) ---- */
export const stocks: StockRecord[] = [
    {
        id: 's001',
        name: 'カローラ',
        modelYear: 2018,
        price: 120,
        mileage: 42000,
        clientId: 'c001',
    },
    {
        id: 's002',
        name: 'ヤリス',
        modelYear: 2020,
        price: 150,
        mileage: 18000,
        clientId: 'c001',
    },
    {
        id: 's003',
        name: 'ノート',
        modelYear: 2019,
        price: 130,
        mileage: 35000,
        clientId: 'c002',
    },
];

/* ---- Photo (車両写真) ---- */
export const photos: PhotoRecord[] = [
    // s001
    { id: 'p001', stockId: 's001', url: 'https://example.com/s001-1.jpg', isMain: true },
    { id: 'p002', stockId: 's001', url: 'https://example.com/s001-2.jpg', isMain: false },
    // s002
    { id: 'p003', stockId: 's002', url: 'https://example.com/s002-1.jpg', isMain: true },
    // s003
    { id: 'p004', stockId: 's003', url: 'https://example.com/s003-1.jpg', isMain: true },
    { id: 'p005', stockId: 's003', url: 'https://example.com/s003-2.jpg', isMain: false },
];
