# 3. N+1 問題と DataLoader での解決

GraphQL の Field Resolver は、ネストされたデータ構造を動的に解決できる反面、**N+1 問題（不要な繰り返しリクエスト）**を引き起こしがちです。

この章では、DataLoader を活用してこの問題を解消し、パフォーマンスと可読性を両立する実装方法を学びます。

---

## 🎯 本章のゴール

- N+1 問題がなぜ起きるかを理解する
- DataLoader を使ってリクエスト単位にバッチ処理する仕組みを理解する
- NestJS における本番想定の DataLoader 実装を習得する
- DataLoader と `JOIN` 系取得との違い・使い分けを理解する

---

## 📘 N+1 問題とは？

たとえば、次のようなクエリを考えてみます：

```graphql
query {
  stocks {
    id
    client {
      id
      name
    }
  }
}
```

この時、次のような処理になりがちです：

1. `stocks` を取得（1 回のクエリ）
2. 各 `stock.client` に対して、個別に client を取得（N 件）

→ 合計 **N+1 回のデータ取得** が発生する（パフォーマンス低下）

---

## 🧪 DataLoader による解決

この N+1 問題を解決するためのユーティリティが **DataLoader** です。
DataLoader を使うと、**同じ GraphQL リクエスト内で複数回呼び出される ID 取得処理を、自動的に 1 回にまとめる**ことができます。

例えば、Field Resolver 内で「Client を取得したい」とします。このとき、以下のように DataLoader を経由して取得します：

```ts
clientLoader.loader.load(stock.clientId);
```

この .load() がリクエスト中に複数回呼ばれた場合でも、DataLoader は内部的に次のように動きます：

```ts
// 自動的にまとめられる仕組み（batchFn）
const clientLoader = new DataLoader(async (ids: string[]) => {
  // clientService.findByIds(ids) は WHERE id IN (...) に相当
  return this.clientService.findByIds(ids);
});
```

✅ 10 件の Stock に対して 10 件の Client を取得していたとしても、 → .load() の呼び出しは 1 回の batchFn() でまとめて処理され、合計 1+1 回の取得で済みます。

このように、

- 「Field Resolver で .load(id) を書く」
- 「Loader 側で .findByIds(ids: string[]) にまとめる」
- 「Repository / DB では WHERE id IN (...) で取得する」
  という三段構成が、DataLoader の効果を発揮するポイントです。

---

## 📘 DataLoader の基本 API 解説

DataLoader は、同じ GraphQL リクエスト内で複数回呼ばれる `.load(key)` を自動でまとめて（バッチ処理して）、1 回の取得に最適化できるユーティリティクラスです。

```ts
new DataLoader<Key, Value>(batchFn: (keys: readonly Key[]) => Promise<Value[]>)
```

### 🔍 主な関数群と使い方

| 関数名               | 概要                          | 典型的な使い方                      | 説明                                                                               |
| -------------------- | ----------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------- |
| `.load(key)`         | 単一のキーに対する取得を要求  | `loader.load('c001')`               | 複数回呼ばれても、同一リクエスト内で自動的にまとめて `batchFn([...])` に渡されます |
| `.loadMany(keys)`    | 複数のキーを一括で取得        | `loader.loadMany(['c001', 'c002'])` | `.load()` を複数回呼ぶのと同じ。バッチ処理される                                   |
| `.clear(key)`        | 特定の key のキャッシュを削除 | `loader.clear('c001')`              | フィールドの再取得が必要なときに使用                                               |
| `.clearAll()`        | 全キャッシュを削除            | `loader.clearAll()`                 | 同一リクエスト内のすべてのキャッシュをリセット                                     |
| `.prime(key, value)` | 手動でキャッシュを事前登録    | `loader.prime('c001', clientObj)`   | 外部で取得済みの値をキャッシュに入れるときに使う                                   |

### 📎 注意点

- `.load()` や `.loadMany()` は非同期関数です。必ず `await` する必要があります。
- `batchFn()` の戻り値は、**keys と同じ順序**でなければいけません。
- 未解決のキーには `undefined` または `null` を返してください。

## ✅ 基本的に使うのは `.load()` と `batchFn()` のペア

ほとんどのユースケースでは、次の 2 つだけを理解していれば十分です：

| 使うもの     | 用途                                                 |
| ------------ | ---------------------------------------------------- |
| `.load(key)` | フィールドごとに 1 件ずつ取得要求                    |
| `batchFn()`  | `.load()` が貯まったタイミングで一括取得（自動実行） |

つまり、

- `.load()` を **Resolver から呼び出す**
- `batchFn()` を **Loader クラス内で定義する**

このペアで DataLoader の基本的な仕組みは成り立ちます。

---

## ✅ NestJS での導入方法（本番想定）

GraphQL における DataLoader の基本的な使い方としては、`context.loaders.xxx` に手動で仕込む方法もありますが、この教材では **NestJS による「本番でも使える構成」を前提**に学んでいきます。

その方法が、NestJS の **依存性注入（DI）機能を活用し、`@Injectable({ scope: Scope.REQUEST })` を使って DataLoader をリクエスト単位で管理する方法**です。

この方式を採用する理由は以下のとおりです：

- **本番環境でもそのまま使えるスケーラブルな設計**
- 他のサービス（例：`ClientService`）を Loader に注入できる
- NestJS の DI コンテナで統一された管理ができる
- テストがしやすく、保守性が高い構造になる

> ※ `@Loader()` デコレーターや `context.loaders.xxx` を使う方法は、簡易的には有効ですが、本教材ではあえて「本番構成に耐える実践的なパターン」に絞って解説していきます。

---

### Loader クラスの構成

```ts
@Injectable({ scope: Scope.REQUEST })
export class ClientLoader {
  constructor(private readonly clientService: ClientService) {}

  readonly loader = new DataLoader<string, ClientRecord>(async (ids) => {
    return this.clientService.findByIds(ids);
  });
}
```

#### 🔍 なぜ Scope.REQUEST が必要なのか？

DataLoader の特性として、「**1 リクエスト内での .load() 呼び出しをバッチ化する**」という仕組みがあります。
そのため、**GraphQL のリクエストごとに新しいインスタンス**を使う必要があるのです。

NestJS においては、通常のサービスはアプリ全体で 1 つのインスタンス（＝シングルトン）として扱われます。
しかし DataLoader をシングルトンにしてしまうと、**リクエストをまたいでキャッシュやバッチングが共有されてしまう**ため、意図しない動作になります。

そのため、以下のように設定します：

```ts
@Injectable({ scope: Scope.REQUEST })
```

これにより、**GraphQL の各リクエストごとに新しく ClientLoader が生成される**ようになり、安全かつ正しくバッチ処理が行われます。

### Resolver での使用

```ts
@Resolver(() => Stock)
export class StockResolver {
  constructor(private readonly clientLoader: ClientLoader) {}

  @ResolveField(() => Client)
  client(@Parent() stock: Stock) {
    return this.clientLoader.loader.load(stock.clientId);
  }
}
```

→ GraphQL のリクエストごとに `ClientLoader` が生成され、`.load()` 呼び出しがバッチ化されます

---

## ⚖️ DataLoader vs JOIN の使い分け

| 観点           | DataLoader                                                                       | JOIN（Left Join）                                                      |
| -------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 主な用途       | GraphQL の Field Resolver の最適化                                               | SQL / ORM による事前の一括取得                                         |
| 実行タイミング | 各 Field Resolver に入ったタイミングで動作                                       | 上位の Query Resolver 等でまとめて実行される                           |
| 柔軟性         | フロントが要求したフィールドだけ処理を実行                                       | 結合先も含めて一括取得するため柔軟性に欠けやすい                       |
| パフォーマンス | 必要なフィールドごとに処理が分かれ、1+1 構造で柔軟性が高い（バッチ最適化も可能） | 1 回のクエリで完結するため速いケースもある（ただし過剰取得の可能性も） |

> ✅ 結合先の情報を常に取得する業務要件であれば JOIN でも OK。
> ただし GraphQL の本質は「必要なものだけを、必要なときに取る」こと。
> その思想に沿うのは DataLoader の設計です。

---

### 🔍 なぜ DataLoader のほうが柔軟か？

- **DataLoader** は、各 Field Resolver の中で `.load(id)` を呼び出します。
  → つまり、**フロントが要求したフィールドだけに対応する処理だけが実行される**。

- 一方、**JOIN を使う場合**は、上位の `Query Resolver` などで
  → **すべてのリレーションデータを先にまとめて取得してしまう**ため、
  → **フロントが使わない情報にも無駄な取得・結合・加工が発生することがある**。

---

このように、「**柔軟に設計したいなら DataLoader**」、「**常にまとめて取るなら JOIN**」という使い分けが重要になります。

---

## 🧾 ログ出力によるバッチ処理の確認

DataLoader を導入すると、複数の `.load()` 呼び出しが **まとめて `batchFn()` に集約される様子**をログで確認できます。

### ✅ 仕込み例（`StockResolver`）

```ts
@ResolveField(() => Client)
async client(@Parent() stock: Stock): Promise<ClientRecord> {
    log.verbose(`Requesting Client ${stock.clientId} for Stock ${stock.id}`);
    const client = await this.clientLoader.loader.load(stock.clientId);
    return client;
}
```

### ✅ 仕込み例（`ClientLoader`）

```ts
readonly loader = new DataLoader<string, ClientRecord>(async (ids) => {
  this.logger.verbose(`🔄 batchFn called with ids: [${ids.join(', ')}]`);
  const clients = this.clientService.findByIds(ids);
  return ids.map((id) => clients.find((c) => c.id === id));
});
```

### 🖨️ 実際のログ出力（例）

以下は、GraphQL の 1 リクエスト内で Stock.client を 3 件解決したときのログです：

```
[Nest] 15758  - 04/18/2025, 12:06:39 PM VERBOSE [StockResolver] Requesting Client c001 for Stock s001
[Nest] 15758  - 04/18/2025, 12:06:39 PM VERBOSE [StockResolver] Requesting Client c001 for Stock s002
[Nest] 15758  - 04/18/2025, 12:06:39 PM VERBOSE [StockResolver] Requesting Client c002 for Stock s003
[Nest] 15758  - 04/18/2025, 12:06:39 PM VERBOSE [ClientLoader] 🔄 batchFn called with ids: [c001, c002]
[Nest] 15758  - 04/18/2025, 12:06:39 PM VERBOSE [ClientService] 🔍 findByIds called with ids = [c001, c002]
```

#### 🔍 説明

- .load() は 3 回呼ばれている（Stock.client が 3 件）
- しかし、ClientLoader の batchFn() は **1 回しか呼ばれていない**
- ClientService.findByIds() により、**WHERE IN 相当の処理**でまとめて取得されている
- 結果として、**N+1 回のアクセスが 1+1 に削減**されている

## 🔧 実装演習：DataLoader の導入（photo / purchaseInfo）

この章では、以下の Field Resolver を DataLoader 化して最適化していきます。

| 対象フィールド       | Loader 名            | 説明                                 |
| -------------------- | -------------------- | ------------------------------------ |
| `Stock.photos`       | `PhotoLoader`        | 写真（複数件）の取得、N+1 をバッチ化 |
| `Stock.purchaseInfo` | `PurchaseInfoLoader` | 購入情報（必ず 1 件）の取得を最適化  |

---

### ✅ 実装ステップ

1. `photo.loader.ts` / `purchase-info.loader.ts` を作成し、`@Injectable({ scope: Scope.REQUEST })` で定義
2. `StockResolver` 側で `.loader.load(stock.id)` を使ってバッチ化
3. バッチの挙動が確認できるよう `console.log()` or `Logger.verbose()` を追加
4. クエリ実行結果が正しく返るか検証

---

## ✅ クエリ例

```graphql
query {
  stocks {
    id
    name
    client {
      id
      name
    }
    photos {
      id
      url
    }
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

## 📝 サンプルログ（batch 処理の実行確認）

```
[Nest] 31391  - 04/18/2025, 2:19:49 PM VERBOSE [ClientLoader] 🔄 batchFn called with ids: [c001, c002]
[Nest] 31391  - 04/18/2025, 2:19:49 PM VERBOSE [ClientService] 🔍 findByIds called with ids = [c001, c002]
[Nest] 31391  - 04/18/2025, 2:19:49 PM VERBOSE [PhotoLoader] 🔄 batchFn called with stockIds: [s001, s002, s003]
[Nest] 31391  - 04/18/2025, 2:19:49 PM VERBOSE [PhotoService] 📸 findByStockIds called with stockIds = [s001, s002, s003]
[Nest] 31391  - 04/18/2025, 2:19:49 PM VERBOSE [PurchaseInfoLoader] 🔄 batchFn called with stockIds: [s001, s002, s003]
[Nest] 31391  - 04/18/2025, 2:19:49 PM VERBOSE [PurchaseInfoService] 📦 findByStockIds called with stockIds = [s001, s002, s003]
```
