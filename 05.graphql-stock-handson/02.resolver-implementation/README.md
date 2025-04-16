# 2. Resolver の責務と分離（GraphQL 実装編）

前章で設計したスキーマを、**NestJS + Code‑First** で実装します。
GraphQL では、スキーマ設計と同じくらい **Resolver の責務分離** が重要です。
パフォーマンス・拡張性・可読性を大きく左右します。

---

## 🎯 本章のゴール

- Query Resolver と Field Resolver の違いを理解する
- データ取得処理をどこに書くべきか、役割分担の考え方を学ぶ
- Resolver 実装時に陥りやすいアンチパターンとその回避法を知る

---

## 📘 学習ステップ

### Step&nbsp;1. Query Resolver / Field Resolver の基本

| 種類               | 役割                                             | 例                             |
| ------------------ | ------------------------------------------------ | ------------------------------ |
| **Query Resolver** | 最上位のエントリポイントでデータ取得の起点になる | `stocks(clientId: ID!)`        |
| **Field Resolver** | Object の各フィールドを個別に解決する            | `Stock.client`, `Stock.photos` |

---

### Step&nbsp;2. Stock / Client / Photo を Resolver で分離実装

| Resolver   | 責務                                  | 実装対象         |
| ---------- | ------------------------------------- | ---------------- |
| **stocks** | `clientId` で絞り込んだ在庫一覧を返す | `Query.stocks()` |
| **client** | `stock.clientId` → Client 詳細を返す  | `Stock.client()` |
| **photos** | `stock.id` → Photo 一覧を返す         | `Stock.photos()` |

> さらに臨場感を出すため、次の **追加フィールド** も Field Resolver で実装します。
>
> - `Stock.priceWithTax`（税込計算）
> - `Client.displayName`（都道府県付き名称）
> - `Photo.thumbnailUrl`（CDN サムネイル URL 生成）

---

### Step&nbsp;3. 実装演習

以下の Resolver ファイルの **`TODO:`** を埋めて、それぞれのデータ取得責務を体験してみましょう。

| ファイルパス                       | 対象 Resolver                                         | 内容                                      |
| ---------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| `demo-skeleton/stock.resolver.ts`  | `Query.stocks`, `Stock.client`, `Stock.photos`        | 在庫に関する基本のネスト解決を実装        |
| `demo-skeleton/client.resolver.ts` | `Query.client`, `Query.clients`, `Client.displayName` | 販売店情報の取得と表記加工を実装          |
| `demo-skeleton/photo.resolver.ts`  | `Query.photosByStock`, `Photo.thumbnailUrl`           | 写真一覧の取得とサムネイル URL 生成を実装 |

---

#### ✅ 実装手順

1. 各 `demo-skeleton/*.resolver.ts` の `TODO:` を埋めて実装
2. `pnpm run start` でアプリを起動し、GraphQL クエリが正しく返るか確認
3. `demo-answer/*.resolver.ts` を見て自分の実装と比較し、
   - `Query` と `Field` の使い分け
   - ロジックの置き所（サービスか Resolver か）
   - ネスト構造の解決方法
     を振り返ってみましょう

---

## ⚠️ よくあるアンチパターン

### ❌ Field Resolver で個別に HTTP リクエストを投げる

```ts
@ResolveField(() => Client)
client(@Parent() stock: Stock) {
  // 一覧 10 件で 10 回呼ばれる → N+1 問題
  return this.clientService.fetchClientById(stock.clientId);
}
```

- N+1 問題の典型例
- 一覧表示では致命的なパフォーマンス低下
- 次章 で DataLoader によるバッチ化を学びます

---

## 🚀 起動手順（おさらい）

```bash
# 依存インストール
pnpm install

# アプリ起動
pnpm run start
# => http://localhost:3000/graphql が立ち上がる
```

---

## 🔍 動作確認クエリ例

```graphql
query {
  stocks {
    id
    name
    modelYear
    price # 税抜
    priceWithTax # 追加フィールド：税込
    mileage
    clientId
    client {
      id
      displayName # 追加フィールド：都道府県付き名称
    }
    photos {
      id
      url
      isMain
      thumbnailUrl
    }
  }
}
```

---

## ✅ 次に進む

次章では、今回発生した N+1 問題 を解決するために、
DataLoader の導入とバッチ処理 を学びます。

👉 3. N+1 問題と DataLoader での解決へ進む
