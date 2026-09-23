# 自然言語処理デモ

ブラウザだけで動く、自然言語処理2026の操作型教材。

- `index.html`: 4つの教材を学習順に並べた自然言語処理デモの入口。
- `vocabulary_builder.html`: 語彙表と単語IDを段階的に作る。
- `cooccurrence.html`: 共起行列、単語ベクトル、コサイン類似度を段階的に作る。
- `cbow.html`: 通常CBOWの学習データ、予測、重み更新、分散表現を確認する。
- `word-vector-space.html`: 学習済み改良CBOWの単語ベクトルを検索・投影する。

## ローカル確認

リポジトリ直下で次を実行する。

```bash
python3 -m http.server 8000
```

`http://127.0.0.1:8000/NLP/` を開く。学習済みモデルのバイナリは `fetch()` で読むため、各HTMLを `file://` で直接開かない。

## モデルと依存物

- `pretrained-vectors.f32`: 『ゼロから作るDeep Learning 2』第4章の `cbow_params.pkl` から、各行をL2正規化してFloat32形式へ変換した100次元・10,000語のベクトル。
- `pretrained-words.json`: 上記モデルの語彙と行番号。
- `vendor/lucide.min.js`: Lucide Icons。ライセンスは `vendor/LICENSE-lucide`。
- `10_simple_cbow_colab_output.ipynb`: CBOW実験室に対応する講義ノートブック。

学習済み単語ベクトル画面では、近傍語とベクトル類推を100次元で計算し、表示対象の語だけをブラウザ内PCAで2次元へ投影する。CBOW実験室の学習もブラウザ内JavaScriptで実行するため、GitHub Pages上でPythonサーバーを必要としない。
