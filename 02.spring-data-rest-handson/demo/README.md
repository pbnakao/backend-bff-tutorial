# spring-data-rest-handson

# 目次

1. ハンズオンの目的
2. Spring Data REST とは
3. 自動生成された エンドポイントを使ってみよう (GET, POST, PUT, PATCH, DELETE)
4. エンドポイントを増やしてみよう

   4-1. 独自のクエリメソッドを追加する（JPA 黒魔術メソッド編）

   4-2. 独自のクエリメソッドを追加する（@Query アノテーション 編）

   4-3. エンドポイントを一から作ってみよう（/companies）

5. レスポンスのオブジェクトをネストさせよう（/users で紐づく company を返す）
6. エンドポイントのカスタマイズ（PK を返す設定、公開設定）

# 1. ハンズオンの目的

## このハンズオンでやること

このハンズオンでは、Spring Data REST を用いて、会社テーブルとユーザーテーブルに CRUD するようなエンドポイントを自動生成します。

![alt text](image-3.png)

## このハンズオンのゴール

- Spring Data REST で生成されるエンドポイントの I/F を理解している
- Spring Data REST を用いて、エンドポイントを自動生成することができる
- 1 つのエンドポイントで関連する別の Entity を取得することができる
- N+1 問題が発生しないコーディングができる
- Spring Data REST におけるエンドポイントをある程度カスタマイズできる

# 2. Spring Data REST とは

> Spring Data REST は Spring Data のライブラリの一つであり、Spring Data REST は、Spring Data で作成したリポジトリを RESTful なエンドポイントとして自動的に公開します。Spring Data REST の機能を利用することによって、Controller や Service クラスの実装を省略する事ができるということです。

出典：「Spring Data REST の要点と利用方法」https://qiita.com/umiushi_1/items/b369f659bbd94576b8f4#spring-data-rest%E3%81%A8%E3%81%AF

公式レファレンス：https://spring.pleiades.io/spring-data/rest/reference/

# 3. 自動生成された エンドポイントを使ってみよう (GET, POST, PUT, PATCH, DELETE)

まずは、アプリケーションを起動してみましょう。

```shell
./gradlew bootRun
```

起動したら、

> http://localhost:8080/swagger-ui

を開きます。

すると、

![alt text](image-4.png)

こんな感じの I/F 仕様書が表示されます。

プリセットの状態では、2 種類のエンドポイントがすでに作成済みです。

- ①：Controller, Service から作った従来通りの API（Customized Users）
- ②：Spring Data REST で自動生成した API（app-user-entity-controller）

① は、src/main/java/com/example/demo/controller/AppUserController.java に Controller が定義されています。

② は、Spring Data REST で自動生成しているため Controller が存在しません。
あるのは Repository（src/main/java/com/example/demo/repository/AppUserRepository.java）のみです。

デフォルトで生成される HTTP メソッドと、そこで呼び出されるメソッドの対応については、公式レファレンスを参照。

> 公式レファレンス：[サポートされている HTTP メソッド](https://spring.pleiades.io/spring-data/rest/reference/repository-resources.html#repository-resources.collection-resource.supported-methods)

では、生成されたエンドポイントを swagger 上で叩いてみて、どのようなデータが返ってくるか試してみましょう。ちなみに DB は H2 DataBase を利用しており、初期状態では src/main/resources/data.sql 内のレコードが流し込まれます。

# 4. エンドポイントを増やしてみよう

## 4-1. 独自のクエリメソッドを追加する（JPA 黒魔術メソッド編）

### 課題 1:

AppUserRepository にメソッドを追加して、クエリパラメータ「companyCode」で App_User を検索できるエンドポイントを生成してください。

<details><summary>課題 1　実装例</summary>

```java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.AppUser;

import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
    public List<AppUser> findByCompanyCode(String companyCode);
}

```

</details>

## 4-2. 独自のクエリメソッドを追加する（@Query アノテーション 編）

### 課題 2:

AppUserRepository にメソッドを追加して、クエリパラメータ「age」よりも年上の App_User を検索できるエンドポイントを生成してください。

ただし、ここでは練習のため"findByAgeGreaterThan"は使わず、"findOlderThan"というメソッド名にしたうえで、@Query アノテーションを使ってみてください。

<details><summary>課題 2　実装例</summary>

```java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.AppUser;

import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, String> {
    public List<AppUser> findByCompanyCode(String companyCode);

    @Query("SELECT user FROM AppUser user WHERE user.age > :age")
    public List<AppUser> findOlderThan(Integer age);
}

```

</details>

## 4-3. エンドポイントを一から作ってみよう（/companies）

### 課題 3:

CompanyRepository を新規作成し、Company を CRUD するエンドポイントを生成してください。

<details><summary>課題 3　実装例</summary>

```java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, String> {
}
```

</details>

# 5. レスポンスのオブジェクトをネストさせよう（/users で紐づく company を返す）

ここまでで /appUsers と/companies の API を作成できましたが、ユーザーと会社のリレーションがまだ表現されていません。

各 Entity にリレーションを定義しましょう。

- AppUser.java

```java
@Data
@Entity
public class AppUser {
    @Id
    @Column(name = "USER_ID", nullable = false)
    private String userId;

----------------------------（略）----------------------------

    @ManyToOne
    @JoinColumn(name = "COMPANY_CODE", nullable = false, insertable = false, updatable = false)
    private Company company;

}
```

- Company.java

```java
@Data
@Entity
public class Company {
    @Id
    @Column(name = "COMPANY_CODE", nullable = false)
    private String companyCode;

----------------------------（略）----------------------------

    @OneToMany
    @JoinColumn(name = "COMPANY_CODE", nullable = false, insertable = false, updatable = false)
    private List<AppUser> appUsers;
}
```

ちなみに、

```
insertable = false, updatable = false
```

がないと怒られます。おまじないとして覚えておきましょう。

この状態でアプリを起動し、/appUsers や/companies を叩いてみましょう。

```json
{
  "firstName": null,
  "lastName": "木野1",
  "email": "kino1@example.com",
  "age": 48,
  "companyCode": "com001",
  "_links": {
    "self": {
      "href": "http://localhost:8080/appUsers/u001"
    },
    "appUser": {
      "href": "http://localhost:8080/appUsers/u001"
    },
    "company": {
      "href": "http://localhost:8080/appUsers/u001/company"
    }
  }
}
```

こんな感じで、"\_links"に参照先のエンティティが出てくるはずです。

### クイズ

さて、I/F とは無関係に、今なにかまずいことが起きています。なんでしょう。
（ヒント：ログ）

<details><summary>解消法</summary>

@OneToMany ではなく、@OneToMany(fetch = FetchType.LAZY)に変更します。

参考：[【Java】Spring Data JPA で N+1 問題が起きないコーディングをしよう。](https://qiita.com/crml1206/items/c2174597f4a62ec5c317)

```java
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPANY_CODE", nullable = false, insertable = false, updatable = false)
    private List<AppUser> appUsers;

```

</details>

### "\_links"ではなく、直接オブジェクトをネストさせる

"\_links"に参照先のエンティティが出てくるようになったものの、/appUsers のレスポンス内に直接 company をネストさせたい場合はどうすればいいでしょうか。

- AppUserRepository に JOIN FETCH するクエリメソッドを追加

```java
public interface AppUserRepository extends JpaRepository<AppUser, String> {
    @Query(value = "select user from AppUser user left join fetch user.company")
    List<AppUser> findAllUsersWithCompany();
}
```

- AppUser の Projection を追加

  参考：[射影と抜粋](https://spring.pleiades.io/spring-data/rest/reference/projections-excerpts.html)

```java
package com.example.demo.projection;

import org.springframework.data.rest.core.config.Projection;

import com.example.demo.entity.AppUser;
import com.example.demo.entity.Company;

@Projection(name = "AppUserExcerpt", types = { AppUser.class })
public interface AppUserExcerpt {

    public String getUserId();

    public String getFirstName();

    public String getLastName();

    public String getEmail();

    public int getAge();

    public Company getCompany();
}
```

- AppUserRepository に AppUserExcerpt を適用する

```java
@RepositoryRestResource(excerptProjection = AppUserExcerpt.class)
public interface AppUserRepository extends JpaRepository<AppUser, String> {
  ----------------------------（略）----------------------------
}
```
