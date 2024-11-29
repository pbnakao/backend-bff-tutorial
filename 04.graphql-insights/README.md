# BFF + BACKEND

# 環境構築

[前提となる環境構築](../00.環境構築/README.md)が完了している前提

## BFF

依存関係のインストール

```sh
# リポジトリルートから
cd 04.graphql-insights/bff
nvm use # .npmrc
corepack enable pnpm
pnpm -v # 9.4.0
pnpm i
```

# サーバ起動

## BFF

```sh
# リポジトリルートから
cd 04.graphql-insights/bff
pnpm start:dev
```

# 前提情報

## 各エンドポイントの状況

### BFF

`http://localhost:3000/graphql`をブラウザで開くことでクエリのエディタが表示されます。

`http://localhost:3000/graphql-view`にアクセスすることでビジュアルにノード間の関係性を確認できます。

# NestJS 補足情報

## NestJS とは

JavaScript のサーバサイドフレームワークのことです。JavaScript の SpringBoot みたいなもの。

## NestJS で GraphQL をやる

NestJS で GraphQL をやるとき、GraphQL の登場人物（Schema/Resolver）が「クラス」と「アノテーション」で表現されます。

例えば、以下のような GraphQL のスキーマは

```gql
type User {
  id: String!
  name: String!
  company: Company!
}
```

以下のように書くことで実装できます(`bff/src/graphql/user/models/user.model.ts`)。

```ts
import { Field, ObjectType } from "@nestjs/graphql";
import { Company } from "src/graphql/company/models/company.model";

@ObjectType() // GraphQLのtypeであることを表現するアノテーション
export class User {
  @Field(() => String) // クラス内の各プロパティのGraphQLでのマッピング(id: String!)と対応する。
  id: number;
  @Field(() => String)
  name: string;
  @Field(() => Company)
  company: Company;
}
```

リゾルバーは以下のようになります。

例えば、以下のようなクエリがあるとき、

```gql
type Query {
  users(page: Int, size: Int, sort: [String!]): [User!]!
}
```

Resolver は以下のように実装できます(`bff/src/graphql/users/users.resolver.ts`)。

```ts
import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "../user/models/user.model";
import { AppUserEntityControllerService, EntityModelAppUser } from "src/generated";
import { map, Observable } from "rxjs";
import { UserArgs } from "./models/users.args";

@Resolver() // リゾルバーであることを意味するアノテーション
export class UsersResolver {
  constructor(private readonly userService: AppUserEntityControllerService) {} // DIするインスタンス(Spring Bootの@Autowiredと同じ)
  @Query(() => [User]) // [User]を返すQueryであることを意味する。
  public users(
    @Args() args: UserArgs // @Args()というアノテーションでGraphQLの引数にアクセスできる。UserArgsの中身は後述
  ): Observable<EntityModelAppUser[]> {
    return this.userService
      .getCollectionResourceAppuserGet1(
        // 実装の内容などは後述するが、バックエンドAPIを呼び出している。
        args.page,
        args.size,
        args.sort
      )
      .pipe(
        // 値の加工
        map((res) => res.data),
        map((v) => v._embedded.appUsers)
      );
  }
}
```

UserArgs の定義(`bff/src/graphql/users/models/users.args.ts`)。

```ts
import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType() // Queryの引数を意味するアノテーション
export class UserArgs {
  @Field(() => Int, { nullable: true }) // null許容(!をつけない)の設定はアノテーションの第二引数で指定
  page?: number;
  @Field(() => Int, { nullable: true })
  size?: number;
  @Field(() => [String], { nullable: true })
  sort?: Array<string>;
}
```

これらを実装し、サーバを起動することで`bff/src/schema.gql`にスキーマ情報が出力されます。

## NestJS のモジュール生成機能

NestJS にはテンプレート生成機能があるのでなるべく積極的にそれを利用するしたほうがよいです（お決まりのコードをお決まりの形で書かないと動かないので手で書くのはミスしやすい）。

以下のようなコマンドをたたきます。

```console
Usage: nest generate|g [options] <schematic> [name] [path]
```

具体的には例えば、users に関する Resolver を作成する際は

```sh
pnpm nest g resolver graphql/users # resolverをgraphql/usersというディレクトリに生成するという意味
```

とコマンドを打つと
`bff/src/graphql/users`配下に`users.resolver.ts`と`users.resolver.spec.ts`（テストコードのファイル）が生成されます。
