WSLやUbuntuのインストールが済んでいない人向け。

# 1. wslのインストール
powershell上にて以下のコマンドを実行。
管理者権限を求められる&インストール後再起動が求められる。

```sh
wsl --install
```

参考)
https://learn.microsoft.com/ja-jp/windows/wsl/install

# 2. Ubuntuのインストール

以下のページからインストールする。（24.04のリンクだが、22.04などでも大体いけるはず）
https://apps.microsoft.com/detail/9nz3klhxdjp5?hl=ja-jp&gl=JP

インストール後、アプリを起動して初期設定情報を入力(Unixユーザ名・パスワードなど。任意のもので可）。


# 3. VSCodeのインストール

以下のページからダウンロードし、インストーラーを実行。すでにVSCodeをインストール済みの場合はスキップ。
https://azure.microsoft.com/ja-jp/products/visual-studio-code

WSLでVSCodeを利用するため、以下の拡張機能をインストールします（Installを押下するとVSCodeを開くはず）。

https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl

補足：
WSLのUbuntuターミナル上で `code <path>`とコマンドを打つことでそのディレクトリをVSCodeで開くことができます。

```console
$ ~/work/java: code . # ~/work/javaディレクトリをVSCodeで開く
```