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

## Step 0. 🧩 Resolver の責務（抽象化された設計原則）

### Query Resolver（起点）

| 内容      | 説明                                                                    |
| --------- | ----------------------------------------------------------------------- |
| ✅ 責務   | データ取得のエントリポイントとして、条件付き/条件なしのデータ集合を返す |
| ✅ 対象   | 一覧系・詳細系の最上位クエリ（例: `stocks`, `client(id)`）              |
| ✅ 処理例 | DB/API アクセス、検索条件の抽象化、ページング・ソート・フィルター       |

---

### Field Resolver（構造と再構成）

| 内容      | 説明                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| ✅ 責務   | 親オブジェクトの context に基づき、関連フィールドを解決する                    |
| ✅ 対象   | リレーション（1 対 1, 1 対多）、派生値、正規化構造の再構成など                 |
| ✅ 処理例 | `stock.client` や `purchaseInfo.supplier`、`priceWithTax` のような加工値の算出 |

---

### Model（ObjectType）

| 内容    | 説明                                                 |
| ------- | ---------------------------------------------------- |
| ✅ 責務 | フロントエンドと共有する構造（語彙）の定義           |
| ✅ 対象 | ドメイン語彙を GraphQL スキーマとして明文化したもの  |
| ✅ 特徴 | 再利用・ネスト・ドキュメント化・テスト性の向上に寄与 |

---

### Service（取得と変換の責任）

| 内容    | 説明                                                          |
| ------- | ------------------------------------------------------------- |
| ✅ 責務 | Resolver から分離された「取得・変換・加工」処理を担う         |
| ✅ 対象 | データ取得・ID 検索・フィルター・変換・ドメインルール判定など |
| ✅ 特徴 | Resolver を薄く保ち、再利用性とテスト性を高める               |

---

### 全体構造としての定義

| 区分             | 役割                               |
| ---------------- | ---------------------------------- |
| `Query`          | フロントの起点、ドメインの集約単位 |
| `Field Resolver` | リレーションや派生値の解決を分離   |
| `Model`          | ドメイン語彙のデータ構造定義       |
| `Service`        | 取得・変換・ロジック処理の実体     |

> 📌 GraphQL における Resolver の責務とは、
> **「ドメインの語彙と構造を、最小責任単位で分解し、必要な箇所で再構成すること」**

---

## 📘 学習ステップ

### Step&nbsp;1. Query Resolver / Field Resolver の基本

GraphQL における Resolver は、大きく **Query Resolver**（データ取得の起点）と
**Field Resolver**（構造を展開・解決するフィールド単位の責務）に分かれます。

> この 2 つの責務の違いを明確に理解しておくことが、
> 今後のスキーマ実装・責務分離・最適化（N+1 解消など）すべての基盤になります。

まずはこの違いを整理し、以降の演習や実装の前提としましょう。

| 種類               | 役割                                             | 例                             |
| ------------------ | ------------------------------------------------ | ------------------------------ |
| **Query Resolver** | 最上位のエントリポイントでデータ取得の起点になる | `stocks(clientId: ID!)`        |
| **Field Resolver** | Object の各フィールドを個別に解決する            | `Stock.client`, `Stock.photos` |

---

### Step&nbsp;2. Stock / Client / Photo を Resolver で分離実装

GraphQL においては、「親となる型（この場合は Stock）」と「関連型（Client, Photo）」の **関係性と責務の分離** を明確に設計・実装することが重要です。

まずは `Stock` を中心に、関連するデータ（Client, Photo）をどのように分離・解決するかを整理します。

| Resolver   | 種類           | 責務                                  | 実装対象         |
| ---------- | -------------- | ------------------------------------- | ---------------- |
| **stocks** | Query Resolver | `clientId` で絞り込んだ在庫一覧を返す | `Query.stocks()` |
| **client** | Field Resolver | `stock.clientId` → Client 詳細を返す  | `Stock.client()` |
| **photos** | Field Resolver | `stock.id` → Photo 一覧を返す         | `Stock.photos()` |

> `stocks` は最上位の Query Resolver です。
> `client` と `photos` は Stock 型の各フィールドを個別に解決する Field Resolver として実装します。

---

### Step&nbsp;3. 関連型（Client, Photo）側の Resolver 実装に進む

次に、Stock に紐づく構造とは別に、**Client や Photo 単体での取得や表示の加工処理**についても Resolver を設計・実装してみましょう。

これにより、「複数の GraphQL 型が連携しながらも責務を分離して実装される」構造を実体験できます。

> 例えば、`Client.displayName` のような表示名加工は `Stock` ではなく `ClientResolver` 側で定義すべきです。

**演習では次のような追加 Field Resolver も対象とします：**

- `Stock.priceWithTax`（税込価格計算）
- `Client.displayName`（都道府県付きの販売店名）
- `Photo.thumbnailUrl`（画像 URL にパラメータを付加して CDN 表示）

---

この流れにより、**「中心オブジェクト（Stock）を起点に、関連データや派生値をどのように切り分けるか」**
という GraphQL 実装における重要な設計感覚を身につけてもらうことが狙いです。

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

## ✍️ 発展課題：正規化された仕入情報・仕入先を追加実装せよ

在庫データ（Stock）には、**仕入情報（PurchaseInfo）と仕入先（Supplier）** も紐づいています。
これらを正規化された形で、GraphQL のスキーマ・Resolver に統合してください。

---

### 🎯 やること

以下の 2 つの Entity に対して、必要な **Model / Resolver / Service / Module** を作成しましょう：

| Entity         | 内容                           | 関連スキーマ例             |
| -------------- | ------------------------------ | -------------------------- |
| `PurchaseInfo` | いつ・どこから仕入れたか       | `purchaseDate`, `supplier` |
| `Supplier`     | 仕入先の業者情報（名前・電話） | `name`, `phone`            |

> 💡 モックデータ `purchaseInfos` から `supplierName + phone` をキーにユニークな Supplier を構築しましょう

---

### ✅ 具体的なタスク一覧

1. `purchase-info.model.ts` / `supplier.model.ts` を定義
2. `purchase-info.service.ts` を作成し、StockId で PurchaseInfo を返せるようにする
3. `supplier.service.ts` を作成し、PurchaseInfo から Supplier を解決できるようにする
4. `purchase-info.resolver.ts` を作成し、Field Resolver で `supplier` を解決
5. `stock.resolver.ts` に `@ResolveField(() => PurchaseInfo)` を追加
6. Playground で以下のクエリが動作することを確認：

```graphql
query {
  stocks {
    id
    purchaseInfo {
      purchaseDate
      supplier {
        name
        phone
      }
    }
  }
}
```

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

## ✅ 次に進む

次章では、今回発生した N+1 問題 を解決するために、
DataLoader の導入とバッチ処理 を学びます。

👉 3. N+1 問題と DataLoader での解決へ進む
