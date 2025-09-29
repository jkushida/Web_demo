# Webデモ

このリポジトリは、さまざまなウェブデモをまとめたものです。

## デモ一覧

### データ構造とアルゴリズム
*   [Stairs Recursion](https://jkushida.github.io/Web_demo/DSA/stairs_recursion.html) - 再帰による階段の登り方問題のデモ
*   [Tower of Hanoi](https://jkushida.github.io/Web_demo/DSA/hanoi.html) - ハノイの塔のインタラクティブなデモ
*   [River Crossing](https://jkushida.github.io/Web_demo/DSA/river-crossing.html) - 川渡り問題のシミュレーション

### 進化計算
*   [GA OneMax](https://jkushida.github.io/Web_demo/EC/ga-onemax.html) - OneMax問題を解く遺伝的アルゴリズムのデモ
*   [CMA-ES Simulator](https://jkushida.github.io/Web_demo/EC/cmaes_simulator.html) - CMA-ESのシミュレータ
*   [DE Simulator](https://jkushida.github.io/Web_demo/EC/de_simulator.html) - 差分進化のシミュレータ
*   [PSO Simulator](https://jkushida.github.io/Web_demo/EC/pso_simulator.html) - 粒子群最適化のシミュレータ
*   [ACO TSP](https://jkushida.github.io/Web_demo/EC/aco_tsp.html) - アントコロニー最適化によりTSPの近似解探索を可視化するデモ
*   [GP Regression](https://jkushida.github.io/Web_demo/EC/gp_regression.html) - 遺伝的プログラミングによる関数回帰デモ

### 機械学習（Machine Learning）
*   [k-means Clustering](https://jkushida.github.io/Web_demo/ML/k-means.html) - セントロイドの移動と点-重心のエッジをアニメ表示
*   [Polynomial Regression & Overfitting](https://jkushida.github.io/Web_demo/ML/polynomial-overfitting.html) - 次数とTrain/Test誤差の関係を可視化
*   [PCA Educational Demo](https://jkushida.github.io/Web_demo/ML/pca_educational_demo.html) - PCAの計算過程（共分散・固有値・射影）を学習

## ローカル実行

静的サイトのためビルド不要です。リポジトリ直下で以下を実行し、ブラウザで表示してください。

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

## 貢献

ガイドラインは [AGENTS.md](./ML/AGENTS.md) を参照してください。外部依存の追加や構成変更は事前相談をお願いします。
