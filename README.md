# Webデモ

このリポジトリは、さまざまなウェブデモをまとめたものです。

## デモ一覧

### データ構造とアルゴリズム

- **再帰・状態空間探索**
  - [Water Jug Problem](https://jkushida.github.io/Web_demo/DSA/water-jug-problem.html) - 4Lと3Lの水差しで2Lを作るシミュレーション
  - [Stairs Recursion](https://jkushida.github.io/Web_demo/DSA/stairs_recursion.html) - 再帰による階段の登り方問題のデモ
  - [Tower of Hanoi](https://jkushida.github.io/Web_demo/DSA/hanoi.html) - ハノイの塔のインタラクティブなデモ
  - [River Crossing](https://jkushida.github.io/Web_demo/DSA/river-crossing.html) - 川渡り問題のシミュレーション

- **探索・数え上げ・ハッシュ**
  - [Euclidean Algorithm Visualizer](https://jkushida.github.io/Web_demo/DSA/euclidean-algorithm.html) - ユークリッドの互除法で最大公約数を求める過程を可視化
  - [Sentinel Search Comparison](https://jkushida.github.io/Web_demo/DSA/sentinel-search.html) - 番兵あり・なしの線形探索を並べて、要素比較と範囲確認の差を可視化
  - [Hash Search](https://jkushida.github.io/Web_demo/DSA/hash-search.html) - ハッシュ法の探索例と衝突処理を、オープンアドレス法/チェイン法で可視化
  - [Maze Search (BFS/DFS)](https://jkushida.github.io/Web_demo/DSA/maze-search.html) - 幅優先/深さ優先で迷路を探索。探索木とログを動的表示

- **線形データ構造**
  - [Singly Linked List](https://jkushida.github.io/Web_demo/DSA/singly-linked-list.html) - 単方向リストの挿入・削除で、nextポインタのつなぎ替えをステップごとに可視化

- **木・グラフ**
  - [Huffman Coding](https://jkushida.github.io/Web_demo/DSA/huffman-coding.html) - 出現頻度からハフマン木を構築し、符号表・平均符号長・エントロピーHを可視化
  - [Graph Visualizer](https://jkushida.github.io/Web_demo/DSA/graph-visualizer.html) - BFS/最短経路などの可視化
  - [BST / AVL Rotation Visualizer](https://jkushida.github.io/Web_demo/DSA/bst-avl-rotation.html) - 同じ挿入列で BST と AVL を並べ、回転と木の高さの差を可視化

- **ソート**
  - [Heap Sort Visualizer](https://jkushida.github.io/Web_demo/DSA/heap-sort.html) - 最大ヒープの構築からソートまでの過程を木構造で可視化
  - [Bubble Sort Animation](https://jkushida.github.io/Web_demo/DSA/bubble-sort-animation.html) - 配列のスワップ移動と疑似コードの対応でバブルソートを可視化
  - [Selection Sort Animation](https://jkushida.github.io/Web_demo/DSA/selection-sort-animation.html) - 未ソート部分から最小値を探し，a[i] と交換
  - [Insertion Sort Animation (Swap Ver.)](https://jkushida.github.io/Web_demo/DSA/insertion-sort-animation.html) - 隣接交換で1データずつ前へ送る挿入ソート
  - [Insertion Sort Animation (ins/cmp/temp Ver.)](https://jkushida.github.io/Web_demo/DSA/insertion-sort-shift-animation.html) - 後ろへまとめてずらして挿入する版

### 進化計算
- [GA OneMax](https://jkushida.github.io/Web_demo/EC/ga-onemax.html) - OneMax問題を解く遺伝的アルゴリズムのデモ
- [CMA-ES Simulator](https://jkushida.github.io/Web_demo/EC/cmaes_simulator.html) - CMA-ESのシミュレータ
- [DE Simulator](https://jkushida.github.io/Web_demo/EC/de_simulator.html) - 差分進化のシミュレータ
- [PSO Simulator](https://jkushida.github.io/Web_demo/EC/pso_simulator.html) - 粒子群最適化のシミュレータ
- [ACO TSP](https://jkushida.github.io/Web_demo/EC/aco_tsp.html) - アリコロニー最適化でTSP
- [Genetic Programming Regression](https://jkushida.github.io/Web_demo/EC/gp_regression.html) - 遺伝的プログラミングによる回帰

### 機械学習
- [k-means Clustering](https://jkushida.github.io/Web_demo/ML/k-means.html) - k-meansクラスタリングのシミュレーション
- [Polynomial Regression & Overfitting](https://jkushida.github.io/Web_demo/ML/polynomial-overfitting.html) - 多項式回帰と過学習のデモ
- [PCA Educational Demo](https://jkushida.github.io/Web_demo/ML/pca_educational_demo.html) - 主成分分析（PCA）の教育用デモ

### MediaPipe
- [Finger Draw](https://jkushida.github.io/Web_demo/MediaPipe/finger_draw.html) - 手と顔の検出による3D描画
- [Boid Fish (Hand Control)](https://jkushida.github.io/Web_demo/MediaPipe/boid-fish-hand-control.html) - 手の動きで群れ（Boids）の魚を制御
- [3D Physics × Hand Tracking](https://jkushida.github.io/Web_demo/MediaPipe/mediapipe_physics_3d.html) - 3D物理×ハンドトラッキング
- [Emotion Recognition](https://jkushida.github.io/Web_demo/MediaPipe/emotion_recognition.html) - 表情認識（Face Mesh + face-api.js）

### 音声処理 (Audio)
- [マイク波形（リアルタイム）](https://jkushida.github.io/Web_demo/Audio/mic-waveform.html) - マイク入力の時間波形をリアルタイム描画
- [リアルタイムFFT（波形+スペクトラム）](https://jkushida.github.io/Web_demo/Audio/realtime-audio-fft-plot.html) - 波形と周波数スペクトラムを同時表示
- [リアルタイムFFT+スペクトログラム](https://jkushida.github.io/Web_demo/Audio/realtime-audio-fft-spec-plot.html) - 波形・スペクトラム・スペクトログラムを同時表示
- [音声コマンド認識（TF.js + Chart）](https://jkushida.github.io/Web_demo/Audio/speech-commands-chart.html) - 音声コマンドの認識結果を可視化
- [リアルタイム日本語スピーチ→テキスト（Web Speech API）](https://jkushida.github.io/Web_demo/Audio/ja-speech-to-text.html) - 日本語音声をブラウザで逐次認識し、テキストを表示
- [Fourier Epicycles](https://jkushida.github.io/Web_demo/DSA/fourier-epicycles.html) - 手描き軌跡のフーリエ復元
