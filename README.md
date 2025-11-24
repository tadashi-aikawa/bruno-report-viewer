# Bruno Report Viewer

Bruno のレポート JSON をブラウザでサッと確認するためのビューア。

`tests {}` で記載されたテスト結果を確認するための **最短経路** を提供します。

> [!WARNING]
> BrunoのJSONレポートすべてを表示することは目的としていません。

## 前提条件

- Bun v1.3 以上

## 起動コマンド

```sh
bun install
bun build:serve <report.json>  # Bruno の JSONレポート を指定
```

`localhost:3000` にアクセスして画面が表示されればOK。

## 開発者用コマンド

### 開発時

WebとAPIでそれぞれ起動が必要。

- **Web:** `bun dev` (hot reload)
    - `localhost:5173` にアクセス
- **API**: `bun serve <report.json>`
    - あらかじめ `bun run build` で `dist` 配下を生成しておく必要あり

### 型チェック

```
bun typecheck
```

