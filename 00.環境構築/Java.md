「00.WSLセットアップ」作業を前提とする。

以下、Ubuntuターミナル上で以下のコマンドを実行する。

# zip/unzipのインストール

次のステップでインストールするsdkmanのインストールに必要なため。

```sh
sudo apt update
sudo apt install zip unzip
```

# sdkmanのインストール
sdkmanはJavaやgradleなどJVM系の言語・ツールのパッケージマネージャー。

```sh
curl -s "https://get.sdkman.io" | bash
```

コンソールに実行するコマンドが出力されるはずなので実行する。

コマンドインストール確認
```sh
sdk help
```

サブコマンドの説明などが表示されればOK。

# Javaのインストール
以下のコマンドを実行する。
現時点(2024/06/17)の場合、Javaの21系がインストールされるはず。
ハンズオンでバージョンの指定がある場合などは所定のバージョンでインストールする。

```sh
sdk install java
```

インストール確認

```sh
java --version
```