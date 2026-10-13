# 有益な外部リンク

- `ml-algorithm-visualizations.html`: 学習カテゴリ別・操作型優先の44件。画像は`../assets/ml-algorithm-screenshots/`を参照。
- `ml-visualization-resources.html`: 確率統計から生成AIまでの95件の総合リンク集。
- 各HTMLと同名のMarkdownが編集元。共通スタイルは`link-collection.css`。

公開導線はトップページ → 44件版 → 95件版。44件版はアルゴリズムの操作型教材を探す主入口、95件版は統計・数学・評価・AI解釈・分析ツールも含む総合索引とする。両方に共通の教材があるため件数は合算しない。教材の紹介を更新するときは両方の掲載箇所を確認する。

リポジトリ直下から、既存のPandocでHTMLを生成する。

```sh
pandoc resources/ml-algorithm-visualizations.md --standalone --template=resources/link-collection-template.html --toc --toc-depth=2 --css=link-collection.css --output=resources/ml-algorithm-visualizations.html
pandoc resources/ml-visualization-resources.md --standalone --template=resources/link-collection-template.html --toc --toc-depth=2 --css=link-collection.css --output=resources/ml-visualization-resources.html
```

閲覧にビルドや外部スクリプトは不要。リンク先の教材・画面の出典は各項目に記載。
共通テンプレート`link-collection-template.html`で折りたたみ式の目次を生成する。
