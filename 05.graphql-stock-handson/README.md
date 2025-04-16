# GraphQL Hands-on（中古車在庫管理編）

このリポジトリは、**GraphQL のスキーマ設計から Resolver 実装まで**を体験するハンズオン教材です。
題材として「中古車販売店向け在庫管理システム」を採用し、実践的なデータ設計・API 設計・実装方法を段階的に学んでいきます。

---

## 📚 構成

| 章  | 内容                            | フォルダ                             |
| --- | ------------------------------- | ------------------------------------ |
| 1   | GraphQL スキーマの設計入門      | `01.schema-design/`                  |
| 2   | Resolver の責務と分離（実装編） | `02.resolver-implementation/`        |
| 3   | N+1 問題と DataLoader での解決  | `03.dataloader-refactor/`（※準備中） |

---

## ✅ 事前準備

このハンズオンでは、以下の環境構築が済んでいることを前提とします。

### 📦 必要なツール

- Node.js（推奨: `v18` 以上）
- pnpm（`npm install -g pnpm`）
- VSCode（推奨）
- Windows ユーザーの場合は **WSL + Ubuntu**

---

## 🧑‍💻 環境構築ステップ（Windows + WSL 編）

### 1. WSL のインストール（Windows ユーザーのみ）

PowerShell（管理者権限）で以下を実行：

```sh
wsl --install
```

✅ 再起動が求められます
🔗 参考: https://learn.microsoft.com/ja-jp/windows/wsl/install

---

### 2. Ubuntu のインストール

以下から Ubuntu（22.04 または 24.04）をインストール：
👉 https://apps.microsoft.com/detail/9nz3klhxdjp5?hl=ja-jp&gl=JP

---

### 3. Ubuntu 初期設定

アプリ起動後、任意のユーザー名とパスワードを設定

---

### 4. VSCode 連携の確認

Ubuntu ターミナルで以下を実行し、VSCode が開くことを確認：

```sh
code .
```

---

### 5. nvm のインストール（Node.js バージョン管理）

以下のスクリプトで nvm をインストール：

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm help
```

nvm help が表示されれば OK
必要に応じて nvm install 18 && nvm use 18 で Node.js をインストール

---

## 🚀 実行方法（共通）

それぞれの章の `demo` ディレクトリに入り、以下を実行します：

```bash
pnpm install
pnpm run start
```

ブラウザで http://localhost:3000/graphql にアクセスすると、GraphQL Playground が開きます。

---

## 🧑‍🏫 各章の説明

### 🔸 01.schema-design/

- GraphQL スキーマ（SDL 形式）の設計を体験
- 中古車の在庫・販売店・写真のモデルをベースに設計
- ER 図 → スキーマ → クエリ定義 の流れを掴む

👉 [01.schema-design/README.md](./01.schema-design/README.md)

---

### 🔸 02.resolver-implementation/

- スキーマに対応する Resolver を NestJS で実装
- Query Resolver / Field Resolver の役割分担を体験
- N+1 問題 の典型パターンを体感（→ 次章につなぐ）

👉 [02.resolver-implementation/README.md](./02.resolver-implementation/README.md)

---

### 🔸 03.dataloader-refactor/（予定）

- Resolver における N+1 問題 を DataLoader で解決
- BFF における最適なバッチ処理設計を学ぶ

（準備中）

---

## 🗂️ ディレクトリ構成

```graphql
05.graphql-stock-handson/
├── 01.schema-design/
│   ├── README.md
│   ├── schema-answer.graphql
│   └── schema-answer2.graphql
│
├── 02.resolver-implementation/
│   ├── README.md
│   ├── demo/               # 完成版（動作確認できる）
│   └── demo-skeleton/      # TODOありの演習用
│
├── 03.dataloader-refactor/（予定）
│
└── README.md               # ← このファイル

```
