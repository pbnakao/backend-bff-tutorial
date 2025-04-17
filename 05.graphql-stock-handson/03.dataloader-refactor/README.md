# 3. N+1 問題と DataLoader での解決

GraphQL の Field Resolver は、ネストされたデータ構造を動的に解決できる反面、**N+1 問題（不要な繰り返しリクエスト）**を引き起こしがちです。

この章では、DataLoader を活用してこの問題を解消し、パフォーマンスと可読性を両立する実装方法を学びます。

---

## 🎯 本章のゴール

- N+1 問題がなぜ起きるかを理解する
- DataLoader を使ってリクエスト単位にバッチ処理する仕組みを理解する
- NestJS における `@Injectable({ scope: Scope.REQUEST })` を使った本番想定の DataLoader 実装を習得する
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

DataLoader を使えば、同じリクエスト内で発生した `.load(clientId)` をすべてまとめて、**一括で取得**できます。
ただし、その効果を最大化するには、**サービス層が「複数 ID をまとめて処理できる」構造になっている必要があります。**

```ts
// DataLoader の仕組み（WHERE IN 相当の一括取得）
const clientLoader = new DataLoader(async (ids: string[]) => {
  // clientService.findByIds(ids) は WHERE id IN (...) に相当
  return this.clientService.findByIds(ids);
});
```

→ たとえ 10 件の Stock に対して Client を参照していたとしても、
→ **内部では 1 回の「WHERE IN」クエリでまとめて取得される（N+1 → 1+1）**

このように、

- 「Field Resolver で .load(id) を書く」
- 「Loader 側で .findByIds(ids: string[]) にまとめる」
- 「Repository / DB では WHERE id IN (...) で取得する」
  という三段構成が、DataLoader の真の効果を発揮するポイントです。

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

  readonly loader = new DataLoader<string, Client>(async (ids) => {
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

## 🔧 実装演習：ClientLoader / PhotoLoader の導入

この章では、下記の Field Resolver を DataLoader 化してください：

- `Stock.client` → `ClientLoader`
- `Stock.photos` → `PhotoLoader`

### 実装ステップ

1. `client.loader.ts` と `photo.loader.ts` を作成し、`@Injectable({ scope: Scope.REQUEST })` で定義
2. Resolver 側で `clientLoader.loader.load()` を使ってバッチ化
3. コンソールログで `.load()` のバッチ挙動を確認（例：1 回の取得で複数件処理）
4. クエリ結果が正しく返ることを確認

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
  }
}
```
