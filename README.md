# Webデモ

このリポジトリは、さまざまなウェブデモをまとめたものです。

## デモ一覧

### データ構造とアルゴリズム
- [Water Jug Problem](DSA/water-jug-problem.html) - 4Lと3Lの水差しで2Lを作るシミュレーション
- [Stairs Recursion](DSA/stairs_recursion.html) - 再帰による階段の登り方問題のデモ
- [Tower of Hanoi](DSA/hanoi.html) - ハノイの塔のインタラクティブなデモ
- [River Crossing](DSA/river-crossing.html) - 川渡り問題のシミュレーション
- [Maze Search (BFS/DFS)](DSA/maze-search.html) - 幅優先/深さ優先で迷路を探索。探索木とログを動的表示
- [Huffman Coding](DSA/huffman-coding.html) - 出現頻度からハフマン木を構築し、符号表・平均符号長・エントロピーHを可視化
- [Graph Visualizer](DSA/graph-visualizer.html) - BFS/最短経路などの可視化
- [Heap Sort Visualizer](DSA/heap-sort.html) - 最大ヒープの構築からソートまでの過程を木構造で可視化
- [ビーム探索の可視化](DSA/beam_search.html) - テキスト生成におけるビーム探索の動作をステップごとに可視化
- [全探索 vs ビーム探索](DSA/search_comparison.html) - 計算量の爆発的増加と、ビーム探索による効率的な探索の比較
- [オセロAI - ビーム探索](DSA/othello_beam_search.html) - オセロAIがビーム探索を用いて次の一手を決定する過程を可視化

### 進化計算
- [GA OneMax](EC/ga-onemax.html) - OneMax問題を解く遺伝的アルゴリズムのデモ
- [CMA-ES Simulator](EC/cmaes_simulator.html) - CMA-ESのシミュレータ
- [DE Simulator](EC/de_simulator.html) - 差分進化のシミュレータ
- [PSO Simulator](EC/pso_simulator.html) - 粒子群最適化のシミュレータ
- [ACO TSP](EC/aco_tsp.html) - アリコロニー最適化でTSP
- [GP Regression](EC/gp_regression.html) - ガウス過程回帰

### 機械学習
- [k-means Clustering](ML/k-means.html) - k-meansクラスタリングのシミュレーション
- [Polynomial Regression & Overfitting](ML/polynomial-overfitting.html) - 多項式回帰と過学習のデモ
- [PCA Educational Demo](ML/pca_educational_demo.html) - 主成分分析（PCA）の教育用デモ

### MediaPipe
- [Finger Draw](MediaPipe/finger_draw.html) - 手と顔の検出による3D描画
- [Boid Fish (Hand Control)](MediaPipe/boid-fish-hand-control.html) - 手の動きで群れ（Boids）の魚を制御
- [3D Physics × Hand Tracking](MediaPipe/mediapipe_physics_3d.html) - 3D物理×ハンドトラッキング
- [Emotion Recognition](MediaPipe/emotion_recognition.html) - 表情認識（Face Mesh + face-api.js）
- [Face Mesh 画像生成](MediaPipe/face-mesh-generative.html) - MediaPipe Face Meshのランドマーク情報を利用した画像生成デモ

### 音声処理 (Audio)
- [マイク波形（リアルタイム）](Audio/mic-waveform.html) - マイク入力の時間波形をリアルタイム描画
- [リアルタイムFFT（波形+スペクトラム）](Audio/realtime-audio-fft-plot.html) - 波形と周波数スペクトラムを同時表示
- [リアルタイムFFT+スペクトログラム](Audio/realtime-audio-fft-spec-plot.html) - 波形・スペクトラム・スペクトログラムを同時表示
- [音声コマンド認識（TF.js + Chart）](Audio/speech-commands-chart.html) - 音声コマンドの認識結果を可視化
- [リアルタイム日本語スピーチ→テキスト（Web Speech API）](Audio/ja-speech-to-text.html) - 日本語音声をブラウザで逐次認識し、テキストを表示
- [Fourier Epicycles](DSA/fourier-epicycles.html) - 手描き軌跡のフーリエ復元