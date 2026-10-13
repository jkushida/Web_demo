# 有益な外部リンク

- `ml-algorithm-visualizations.html`: 学習カテゴリ別・操作型優先の44件。画像は`../assets/ml-algorithm-screenshots/`を参照。
- `ml-visualization-resources.html`: 確率統計から生成AIまでの95件の総合リンク集。
- 各HTMLと同名のMarkdownが編集元。共通スタイルは`link-collection.css`。

リポジトリ直下から、既存のPandocでHTMLを生成する。

```sh
pandoc resources/ml-algorithm-visualizations.md --standalone --toc --toc-depth=2 --metadata toc-title=目次 --css=link-collection.css --output=resources/ml-algorithm-visualizations.html
pandoc resources/ml-visualization-resources.md --standalone --toc --toc-depth=2 --metadata toc-title=目次 --css=link-collection.css --output=resources/ml-visualization-resources.html
```

閲覧にビルドや外部スクリプトは不要。リンク先の教材・画面の出典は各項目に記載。
