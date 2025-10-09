# Repository Guidelines

## Project Structure & Module Organization
- 入口: `index.html`（各デモへのナビゲーション）。
- アルゴリズム系: `DSA/*.html`（例: `DSA/hanoi.html`, `DSA/river-crossing.html`）。
- 進化計算系: `EC/*.html`（例: `EC/ga-onemax.html`, `EC/de_simulator.html`）。
- 追加リソース: `assets/`（画像・データ等）。参照は必ず相対パス。

## Build, Test, and Development Commands
- ローカル起動: `python3 -m http.server 8000` → `http://localhost:8000/`。
- 反映方法: 静的サイトのためビルド不要。変更後はブラウザでハードリロード。
- 任意整形（ローカルのみ）: `npx prettier -w .`（依存追加はしない想定、CDNも原則不可）。

## Coding Style & Naming Conventions
- インデント: 2 スペース、UTF-8、LF、ファイル末尾に改行。
- HTML: セマンティックタグを優先。インライン `style` は最小限。
- JS: 可能な限りページ末尾の `<script>` で読み込み。関数はキャメルケース（例: `updateState()`）。
- 命名: HTML ファイルはケバブケース（例: `stairs-recursion.html`）。新規は `DSA/` または `EC/` 配下に配置。

## Testing Guidelines
- 目視確認: Chrome/Firefox/Safari で表示崩れがないこと。
- コンソール: エラー/警告 0（DevTools を確認）。
- ナビゲーション: `index.html` から各デモへ遷移でき、リンク切れがないこと。
- 回帰確認: 既存デモのアニメーション/入出力の挙動を変えないこと。

## Commit & Pull Request Guidelines
- コミット: 目的を簡潔に。例: `DSA: ハノイの塔のUI改善`, `EC: Fix DE simulator params`。
- PR 説明: 目的/背景、主要変更点、動作確認手順、影響範囲、関連 Issue、必要ならスクリーンショット・動画。
- 方針: 1 PR = 1 目的。差分は小さく保ち、外部依存や構成変更は事前に相談。

## Security & Configuration Tips
- 外部スクリプト/トラッカーの導入は原則禁止（必要時は理由と影響範囲を明記）。
- ユーザー入力を扱う場合は必ずサニタイズし、信頼できるデータのみで DOM 操作。
- すべてのパスは相対参照。CDN 等の外部依存追加は原則不可。

## Examples
- 新規デモ追加: `DSA/stairs-recursion.html` を作成 → `index.html` にリンクを追加。
- 画像追加: `assets/figs/stairs.png` を相対パスで参照（例: `<img src="../assets/figs/stairs.png" />`）。
