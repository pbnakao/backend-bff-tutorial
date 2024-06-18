「00.WSLセットアップ」作業を前提とする。

以下、Ubuntuターミナル上で以下のコマンドを実行する。

# nvmのインストール(Nodeのパッケージマネージャー)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

パスを通す

```sh
source ~/.bashrc
```

コマンドインストール確認。
サブコマンドの一覧などが表示されればOK。

```sh
nvm help
```


# 特定のバージョンのインストール

特定のバージョンのインストールが必要な場合（今回のハンズオンではリポジトリ側でバージョン指定するので不要）。

```sh
nvm install <version>
nvm use <version>
```