<div align="center">
    <h1>
       Bruno Report Viewer
    </h1>
    <img src="./public/logo.png" width="256" />
    <p>
      <div>BrunoのJSONレポートをブラウザでサッと確認するためのビューア。</div>
      <div>testsで記載されたテスト結果を確認するための<b>最短経路</b>を提供する。</div>
    </p>
</div>

> [!WARNING]
> [BrunoのJSONレポート]すべてを表示することは目的としていません。

[BrunoのJSONレポート]: https://docs.usebruno.com/bru-cli/builtInReporters#json-report

## サポート環境


| 環境 | バージョン   |
| ---- | ------------ |
| [Bun]  | v1.3 以上    |
| [Bruno CLI]  | v2.14.2 以上 |


[Bun]: https://bun.sh/
[Bruno CLi]: https://docs.usebruno.com/bru-cli/overview

## Usage

```
bun serve <report.json> [port:3000] [--open]
```

## クイックスタート

```sh
# ビルド
bun install --frozen-lockfile
bun run build

# 起動
bun serve --open <report.json>  # Bruno の JSONレポート を指定
```

`http://localhost:3000` がブラウザで開かれます。

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

