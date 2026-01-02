# Repository Guidelines

## Project Structure & Module Organization
- 入口: `index.html`（リポジトリ直下）。
- アルゴリズム系: `DSA/*.html`（例: `DSA/hanoi.html`）。
- 進化計算系: `EC/*.html`（例: `EC/ga-onemax.html`）。
- 追加リソース: `assets/` 配下に画像・データ等を配置。参照は全て相対パス。
- 静的サイトのためビルドは不要。ブラウザで更新を確認。

## Build, Test, and Development Commands
- ローカル起動: `python3 -m http.server 8000` → `http://localhost:8000/` を開く。
- ハードリロード: 変更反映はブラウザでハードリロード（キャッシュ無効化）。
- 任意整形: 必要時のみ `npx prettier -w .`（外部依存のため利用前に相談）。

## Coding Style & Naming Conventions
- 基本: インデント2スペース／UTF-8／LF／ファイル末尾に改行。
- ファイル名: ケバブケース（例: `stairs-recursion.html`）。`DSA/`・`EC/`配下に追加。
- HTML: セマンティックタグを優先、インライン`style`は最小限。
- JS: ページ末尾の`<script>`で読み込み。関数名は動詞始まりのキャメルケース（例: `updateState()`）。
- 依存: CDN等の外部依存は原則禁止。相対パスのみ使用。

## Testing Guidelines
- 目視確認: Chrome/Firefox/Safari で表示崩れがないこと。
- コンソール: DevTools のエラー/警告が 0 であること。
- ナビゲーション: `index.html`から各デモへ遷移でき、リンク切れがないこと。
- 回帰: 既存デモの挙動（アニメーション/入出力）を変えないこと。
- 自動テスト: 現状なし。必要に応じて導入を検討。

## Commit & Pull Request Guidelines
- コミット: 簡潔な要約（例: `DSA: ハノイの塔のUI改善`、`EC: Fix DE simulator params`）。
- PR 必須項目: 目的/背景、主要変更点、動作確認手順、影響範囲、関連Issue、必要に応じてスクリーンショット/動画。
- 方針: 1 PR = 1 目的。差分は小さく。外部依存の追加や構成変更は事前相談。

## Security & Configuration Tips
- 外部スクリプト/トラッカーは原則禁止。
- ユーザー入力はサニタイズし、信頼できるデータのみ DOM 操作。
- マルチプラットフォーム（macOS/Linux/Windows）を意識し、相対パスと標準機能で完結。

## Adding a New Demo (Optional)
- 置き場所: `DSA/` または `EC/` に `kebab-case.html` を追加。
- アセット: `assets/` に配置し、相対パスで参照。
- 導線: `index.html` にリンクを追加し、ナビゲーションを確認。

