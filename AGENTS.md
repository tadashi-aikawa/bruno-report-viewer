# Repository Guidelines

このドキュメントはリポジトリ貢献者向けの簡潔なガイドです。Vue 3 + TypeScript + Vite を Bun ランタイムで扱う前提で読み進めてください。

## プロジェクト構成とモジュール配置

- ソース: `src/` にアプリ本体を配置。エントリは `src/main.ts`、ルートコンポーネントは `src/App.vue`。
- UI/ロジック:
    - 再利用コンポーネントは `src/components/`
    - ロジックフックは `src/composables/`
    - 汎用関数は `src/utils/`
    - 型定義は `src/types/`
    - **`src/lib/` と `src/components/ui` は shacen-vue の生成コードが入るので、手動で追加・変更はしない**
- 資産:
    - 静的リソースは `public/`
    - スタイルは `src/style.css` と `src/assets/` を参照。
- ビルド成果物は `dist/`。CLI エントリは `dist/cli.ts` にバンドルされる。
- 設定: TypeScript 設定は `tsconfig.json`、アプリ用は `tsconfig.app.json`。Vite 設定は `vite.config.ts` を参照。

## コーディング規約と命名

- 言語: TypeScript + Vue SFC (`<script setup>`)。型を積極的に付け、`any` は避ける。
- フォーマット: Prettier を使用。インデントは 2 スペース、シングルクォートと末尾セミコロンなしがデフォルト。
- スタイル: Tailwind CSS v4 を利用。ユーティリティは冗長化を避け、`tailwind-merge` で衝突を解消。
- 子コンポーネントで `v-model` を扱う場合は、可能な限り `defineModel` を利用する。
- 命名: コンポーネントは PascalCase、Composable は `useXxx`、ユーティリティは camelCase。ファイルは機能ベースでグループ化。
- インポート: 自動整列（organize imports）を許容。Vue マクロは `defineProps/defineEmits` を明示し、props は型安全に記述。
- パターンマッチ: 呼び出し回数が極端に多い場合を除き `ts-pattern` を使う
- コンポーネントの追加:
    - `src/components` 配下にファイルを作成
    - shadcn-vue の設計思想をrespectすること

## 検証

- `bun verify` が通過すること
