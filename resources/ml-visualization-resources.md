---
title: 機械学習・統計・AIの可視化サイトリンク集
lang: ja
date: 2026-10-12
---

[Webデモへ戻る](../index.html)

調査日: **2026年10月12日**。本編は **95リソース・12分野**、末尾に直接取得できなかった参考候補を3件収録。1サイト内の独立した教材ページも1リソースとして数えているため、95の独立サイトという意味ではない。

公式サイト、著者のページ、大学・研究グループ、公式リポジトリ・論文を横断して調査した。操作型教材を探す場合は[機械学習アルゴリズムの可視化リンク集](ml-algorithm-visualizations.html)も参照。

## まず見る教材

以下は、確認した説明内容に基づく編集上の選定。授業で実際に操作できるかは、使用する端末で事前確認が必要。

| 学びたいこと | 最初の教材 | 次に進む教材 |
| --- | --- | --- |
| 日本語で機械学習全体を学ぶ | [Google 機械学習集中講座](#resource-011) | [AI Explorables 日本語翻訳](#resource-082) |
| 確率と統計の基礎 | [Seeing Theory](#resource-014) | [StatKey](#resource-016) |
| 線形回帰と決定木 | [Linear Regression / MLU](#resource-033) | [Decision Trees / MLU](#resource-035) |
| ニューラルネットワークの学習 | [TensorFlow Playground](#resource-049) | [Calculus on Computational Graphs: Backpropagation](#resource-052) |
| 次元削減と埋め込み | [Principal Component Analysis / EV](#resource-057) | [How to Use t-SNE Effectively](#resource-059) |
| 画像の畳み込み | [Image Kernels / EV](#resource-062) | [CNN Explainer](#resource-063) |
| Transformerと次トークン予測 | [The Illustrated Transformer](#resource-071) | [Transformer Explainer](#resource-069) |
| 生成モデル | [GAN Lab](#resource-075) | [Diffusion Explainer](#resource-076) |
| 強化学習 | [Reinforcement Learning / MLU](#resource-078) | [REINFORCEjs](#resource-077) |
| AIのバイアスとモデル解釈 | [Google PAIR AI Explorables](#resource-081) | [Learning Interpretability Tool (LIT)](#resource-083) |

## 確認状態と調査範囲

「本文」は公式ページ本文を取得できたこと、「JS」はJavaScript主体のため見出しや画面入口までの取得であることを示す。「公式コード」「公式目次」「公式紹介」が付く場合、内容はその一次資料でも照合した。「検索のみ」は公式ページの検索情報は得られたが、直接取得できなかった候補である。

**全掲載サイトのブラウザ操作・学習・推論の完走は検証していない。** ページの取得成功とアプリの動作成功は別である。認証、料金、API利用枠、端末・ブラウザ条件も全件は確認していない。レベル区分は本リンク集での目安で、提供者の公式分類とは限らない。言語は取得したページを基準にし、ブラウザ翻訳を公式日本語対応として数えていない。

対象は、機械学習そのものを見せる操作型教材、視覚解説、モデル・データの可視化ツール。一般的なBI製品、単にグラフを作るライブラリ、可視化のない講座、リンクだけの一般ブログは中心対象から外した。分類の幅を広く取った調査であり、世界中の全サイトの完全網羅を保証するものではない。

## 掲載サイトの補足

- [Seeing Theory](https://seeing-theory.brown.edu/)は、公式ページでアーカイブと明記されている。
- [TensorFlow Playground](https://playground.tensorflow.org/)の取得ページは英語だった。日本語切替は今回確認できなかったため、公式日本語対応とは記載しない。
- [Diffusion Explainerの公式説明](https://github.com/poloclub/diffusion-explainer)はpreset promptsでの実験を案内している。任意プロンプトを受け付ける自由生成サービスとしては紹介しない。
- [LITの公式ページ](https://pair-code.github.io/lit/)での現在の名称はLearning Interpretability Tool。古い資料ではLanguage Interpretability Toolと呼ばれることがある。
- [PAIRの日本語翻訳](https://ai-explorables.explorable-explanations.com/)は有志翻訳として紹介する。原版すべての日本語化や、公式翻訳であることは主張しない。
- R2D3の直接取得は522エラーとなった。公開終了とは断定せず、末尾の再確認候補に置いた。

## 総合教材・教材を探す入口

### 01. [MLU-Explain](https://mlu-explain.github.io/) {#resource-001}

対象: 初級〜中級 / 形式: 操作・スクロール / 言語: 英語 / 確認: 本文

Amazon MLUの視覚教材集。回帰、決定木、評価指標、強化学習などを単元別に読める。下の各分野に直リンクも収録。

### 02. [Explained Visually](https://setosa.io/ev/) {#resource-002}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

Victor Powell・Lewis Leheによる数学の操作型解説。PCA、固有値、回帰、条件付き確率、画像カーネルへの入口。

### 03. [Distill](https://distill.pub/) {#resource-003}

対象: 中級〜上級 / 形式: 図解・操作型論文 / 言語: 英語 / 確認: 本文

図、アニメーション、操作型図を組み込んだ機械学習の論文・解説集。記事ごとに数式量と操作性が異なる。

### 04. [Machine Learning Tokyo: Interactive Tools](https://github.com/Machine-Learning-Tokyo/Interactive_Tools) {#resource-004}

対象: 全般 / 形式: リンク集 / 言語: 英語 / 確認: 本文

深層学習、数学、モデル解釈ツールの索引。古いデモも含むので、リンク先の現状を確認するための探索入口として使う。

### 05. [Explorable Explanations](https://explorabl.es/) {#resource-005}

対象: 全般 / 形式: 教材ポータル / 言語: 英語 / 確認: JS

操作して学ぶ教材を分野横断で探せる入口。機械学習以外の数学、科学、社会的シミュレーションも含む。

### 06. [Explorable Explanations 日本語ポータル](https://explorable-explanations.com/) {#resource-006}

対象: 全般 / 形式: 紹介・翻訳 / 言語: 日本語 / 確認: 本文

探索型教材の日本語紹介を探す入口。外部の原版へのリンクと日本語訳を区別して利用する。

### 07. [ML Visualization](https://www.mlvisualization.com/) {#resource-007}

対象: 初級〜上級 / 形式: 操作 / 言語: 英語 / 確認: 本文

回帰、分類、クラスタリング、前処理、ニューラルネットワークを横断する操作型百科。分野・難易度で教材を絞れる。

### 08. [ML Hive Playground](https://www.mlhive.com/playground) {#resource-008}

対象: 初級〜中級 / 形式: 操作・コード追跡 / 言語: 英語 / 確認: 本文

機械学習・深層学習・画像処理・アルゴリズムの実験集。パラメータ変更とステップ実行、対応コードを結びつける構成。

### 09. [ModelOrigen](https://modelorigen.in/) {#resource-009}

対象: 初級〜上級 / 形式: 操作・解説 / 言語: 英語 / 確認: 本文

回帰・分類からRNN、LSTM、GRU、Attention、評価まで幅広く案内する。教材ページとブラウザ計算型の可視化を組み合わせる。

### 10. [Interactive ML](https://www.interactive-ml.com/) {#resource-010}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

回帰、SVM、Naive Bayes、クラスタリング、混同行列などを操作する教材群。Coming Soonの項目は利用可能教材として数えない。

### 11. [Google 機械学習集中講座](https://developers.google.com/machine-learning/crash-course?hl=ja) {#resource-011}

対象: 初級〜中級 / 形式: 講座・操作・演習 / 言語: 日本語 / 確認: 本文

日本語の公式講座。回帰・分類・埋め込み・LLMなどを、動画、可視化、実践演習で順に学ぶ。演習ごとの実行条件は別途確認。

### 12. [機械学習 Playground](https://ml.kano.ac/playground/) {#resource-012}

対象: 初級〜中級 / 形式: 操作 / 言語: 日本語 / 確認: 検索のみ

日本語の講義参考教材。回帰、正則化やテキスト前処理などの可視化が検索結果で確認できた。今回は直接取得に失敗。

### 13. [AI Simulator](https://ai.simlab.me/ja) {#resource-013}

対象: 初級〜中級 / 形式: 操作 / 言語: 日本語あり / 確認: 検索のみ

日本語ページを持つAI学習用ビジュアルラボ。データ作成とモデル実験を案内している。直接取得できなかったため候補扱い。

## 確率・統計・ベイズ推論

### 14. [Seeing Theory](https://seeing-theory.brown.edu/) {#resource-014}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文・アーカイブ

確率、分布、中心極限定理、推定、ベイズ、回帰を6章で学ぶ。公式にアーカイブと表示されているが、教材への入口は取得できた。

### 15. [Art of Stat: Web Apps](https://artofstat.com/web-apps) {#resource-015}

対象: 初級〜中級 / 形式: 操作・分析 / 言語: 英語 / 確認: 本文

分布、相関、回帰、信頼区間などの統計アプリ集。実データを用いる演習や、グラフと要約統計量の比較に向く。

### 16. [StatKey](https://www.lock5stat.com/StatKey/) {#resource-016}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

ブートストラップ信頼区間、ランダム化検定、標本分布を扱う。再標本化から統計的推論を教える際の有力な入口。

### 17. [Rossman/Chance Applets](https://www.rossmanchance.com/applets/index.html) {#resource-017}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 検索のみ

相関、標本抽出、信頼区間、検定の教材群。公式検索情報を確認。Updated 2021側を優先し、Java・Flashの旧版と区別する。

### 18. [esci web](https://esci.thenewstatistics.com/) {#resource-018}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

効果量、信頼区間、分布、相関、推定精度を図で扱う。統計量の標本間変動を見せる教材。開発中の表示あり。

### 19. [R Psychologist](https://rpsychologist.com/) {#resource-019}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語・一部多言語 / 確認: 本文

Kristoffer Magnussonの統計可視化集。Cohen's d、検出力、p値、信頼区間、最尤推定などを視覚的に扱う。

### 20. [OnlineStatBook](https://onlinestatbook.com/2/) {#resource-020}

対象: 初級〜中級 / 形式: 教科書・操作 / 言語: 英語 / 確認: 本文

統計の教科書にシミュレーションを組み込む。標本分布、中心極限定理、分散、回帰などへ目次から移動できる。

### 21. [Probability Distributions / Simon Ward-Jones](https://www.simonwardjones.co.uk/posts/probability_distributions/) {#resource-021}

対象: 初級 / 形式: 操作 / 言語: 英語 / 確認: 本文

ベルヌーイ、二項、正規、ベータなどの分布を図で比較する。分布のパラメータと形の対応を学ぶ入口。

### 22. [Bayesian Inference / Simon Ward-Jones](https://www.simonwardjones.co.uk/posts/bayesian_inference/) {#resource-022}

対象: 初級〜中級 / 形式: 操作・数式 / 言語: 英語 / 確認: 本文

コイン投げを例に、ベータ事前分布と観測回数・成功数から事後分布を描く。最尤推定との違いも説明。

### 23. [Conditional Probability / EV](https://setosa.io/ev/conditional-probability/) {#resource-023}

対象: 初級 / 形式: 操作 / 言語: 英語 / 確認: 本文

事象の重なりと条件を付けた確率を視覚的に扱う。P(A)とP(A｜B)の区別を導入する短い教材。

### 24. [Markov Chains / EV](https://setosa.io/ev/markov-chains/) {#resource-024}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

状態間の遷移を可視化する。遷移確率と、繰り返した後の状態分布を結びつける教材。

### 25. [DAGitty](https://dagitty.net/) {#resource-025}

対象: 中級〜上級 / 形式: 操作・分析 / 言語: 英語 / 確認: 本文

因果ダイアグラムをブラウザで作成・編集・分析する。交絡と調整変数を扱い、予測モデルと因果推論の違いを補う。

## 線形代数・数学の基礎

### 26. [Immersive Linear Algebra](https://immersivemath.com/ila/index.html) {#resource-026}

対象: 初級〜中級 / 形式: 操作型教科書 / 言語: 英語 / 確認: 本文

ベクトル、内積、行列、線形写像、固有値を操作型図で学ぶオンライン教科書。埋め込みやPCAの前提を補う。

### 27. [Interactive Linear Algebra / Georgia Tech](https://textbooks.math.gatech.edu/ila/) {#resource-027}

対象: 初級〜中級 / 形式: 教科書・図解 / 言語: 英語 / 確認: 本文

連立方程式、線形変換、固有値、射影、最小二乗法を体系的に学ぶ。定義と図の両方を参照したいときに使う。

### 28. [TU Delft PRIME Applets](https://openla.ewi.tudelft.nl/) {#resource-028}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: JS・公式検索

TU Delftの線形代数教材に対応する2D・3Dの操作型図集。線形代数に加えて微積分・確率統計への入口もある。

### 29. [Eigenvectors and Eigenvalues / EV](https://setosa.io/ev/eigenvectors-and-eigenvalues/) {#resource-029}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

行列の列ベクトルと入力ベクトルを動かし、方向を変えない固有ベクトルを探す。反復変換と定常状態にも接続。

### 30. [Interactive Fourier Transforms](https://www.jezzamon.com/fourier/) {#resource-030}

対象: 初級〜中級 / 形式: 操作・音 / 言語: 英語・多言語 / 確認: 本文

描いた波形や図形を周波数成分に分ける。音の再生と波の合成を使い、画像・音声処理の前提を体感できる。

### 31. [3Blue1Brown](https://www.3blue1brown.com/) {#resource-031}

対象: 初級〜中級 / 形式: 動画・図解 / 言語: 英語 / 確認: 本文

線形代数、微積分、ニューラルネットワークを幾何学的アニメーションで解説。主に動画・図解で、操作型実験とは区別する。

### 32. [BetterExplained](https://betterexplained.com/) {#resource-032}

対象: 初級〜中級 / 形式: 図解・一部操作 / 言語: 英語 / 確認: 本文

数学の直観を図と具体例で説明する記事集。指数、微積分、確率など、機械学習の前提を補う副教材。

## 回帰・分類・クラスタリング

### 33. [Linear Regression / MLU](https://mlu-explain.github.io/linear-regression/) {#resource-033}

対象: 初級 / 形式: 操作・解説 / 言語: 英語 / 確認: JS・公式目次

回帰直線と最小二乗法を視覚的に導入する単元。線形回帰の授業への直リンク。

### 34. [Logistic Regression / MLU](https://mlu-explain.github.io/logistic-regression/) {#resource-034}

対象: 初級 / 形式: 操作・解説 / 言語: 英語 / 確認: JS・公式目次

シグモイドによる確率予測と二値分類を扱う。回帰と分類の関係を導入する教材。

### 35. [Decision Trees / MLU](https://mlu-explain.github.io/decision-tree/) {#resource-035}

対象: 初級〜中級 / 形式: 操作・スクロール / 言語: 英語 / 確認: 本文

分割境界を動かし、エントロピーと情報利得を比較する。木の深さと過学習まで一続きで学ぶ。

### 36. [Random Forest / MLU](https://mlu-explain.github.io/random-forest/) {#resource-036}

対象: 初級〜中級 / 形式: 操作・解説 / 言語: 英語 / 確認: 本文

決定木の集合と投票、標本・特徴量に入れるランダム性を図で説明。単一の木からアンサンブルへの接続に使う。

### 37. [Gradient Boosting / explained.ai](https://explained.ai/gradient-boosting/) {#resource-037}

対象: 中級 / 形式: 図解・数式 / 言語: 英語 / 確認: 本文

予測の残差を次のモデルで補う考え方を、図と数式で詳しく追う。操作型アプリよりも丁寧な視覚解説として利用。

### 38. [Ordinary Least Squares / EV](https://setosa.io/ev/ordinary-least-squares-regression/) {#resource-038}

対象: 初級 / 形式: 操作 / 言語: 英語 / 確認: JS・見出し

最小二乗回帰の視覚的説明。点と直線、係数の関係を学ぶための短い単元。

### 39. [SVMJS Demo](https://cs.stanford.edu/people/karpathy/svmjs/demo/) {#resource-039}

対象: 中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

2次元データを使うSVMの実験。カーネルや正則化と、決定境界・支持ベクトルの関係を扱う。

### 40. [Visualizing K-Means Clustering](https://www.naftaliharris.com/blog/visualizing-k-means-clustering/) {#resource-040}

対象: 初級 / 形式: 操作 / 言語: 英語 / 確認: 本文

Naftali Harrisによるk-means可視化。点のクラスタへの割当てと重心更新を反復して観察する。

## モデル評価・汎化・公平性の指標

### 41. [Train, Test and Validation / MLU](https://mlu-explain.github.io/train-test-validation/) {#resource-041}

対象: 初級 / 形式: 操作・解説 / 言語: 英語 / 確認: 本文

学習・検証・テストを分ける理由を図で説明。モデル選択と最終評価を混同しないための教材。

### 42. [Cross-Validation / MLU](https://mlu-explain.github.io/cross-validation/) {#resource-042}

対象: 初級〜中級 / 形式: 操作・解説 / 言語: 英語 / 確認: JS・公式目次

k-foldで評価用の分割を入れ替える仕組みを可視化。単一分割との差を学ぶ。

### 43. [Bias-Variance Tradeoff / MLU](https://mlu-explain.github.io/bias-variance/) {#resource-043}

対象: 初級〜中級 / 形式: 操作・解説 / 言語: 英語 / 確認: 本文

モデルの複雑さと未学習・過学習の関係を視覚的に探る。汎化性能の導入に使う。

### 44. [Double Descent / MLU](https://mlu-explain.github.io/double-descent/) {#resource-044}

対象: 中級〜上級 / 形式: 図解・操作 / 言語: 英語 / 確認: 本文

モデルの複雑さを増やしたときの二重降下を解説。通常のU字型の説明を発展させる。

### 45. [Double Descent: Mathematical Explanation / MLU](https://mlu-explain.github.io/double-descent2/) {#resource-045}

対象: 上級 / 形式: 図解・数式 / 言語: 英語 / 確認: 本文

二重降下をスプラインと数式から掘り下げる続編。前の視覚的導入を読んだ後に使う。

### 46. [ROC & AUC / MLU](https://mlu-explain.github.io/roc-auc/) {#resource-046}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: JS・公式目次

分類閾値と真陽性率・偽陽性率、ROC曲線の関係を扱う。AUCの意味を図で導入。

### 47. [Precision & Recall / MLU](https://mlu-explain.github.io/precision-recall/) {#resource-047}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: JS・公式目次

適合率・再現率、F1、混同行列を扱う。正解率だけでは評価しにくい分類問題の導入。

### 48. [Equality of Odds / MLU](https://mlu-explain.github.io/equality-of-odds/) {#resource-048}

対象: 中級 / 形式: 操作・解説 / 言語: 英語 / 確認: JS・公式目次

集団間での分類性能と公平性指標を扱う。閾値を選ぶ際の社会的な含意を考える。

## ニューラルネットワーク・誤差逆伝播・最適化

### 49. [TensorFlow Playground](https://playground.tensorflow.org/) {#resource-049}

対象: 初級〜中級 / 形式: ブラウザ学習 / 言語: 英語 / 確認: 本文

層数、ユニット数、活性化関数、学習率、正則化を変更し、2次元分類・回帰を学習する。各ニューロンの出力と損失を比較。

### 50. [ConvNetJS](https://cs.stanford.edu/people/karpathy/convnetjs/) {#resource-050}

対象: 初級〜中級 / 形式: ブラウザ学習 / 言語: 英語 / 確認: 本文

Andrej Karpathyのブラウザ学習デモ集。2D分類、回帰、MNIST、オートエンコーダ、最適化手法比較への入口。古い実装として利用。

### 51. [Neural Networks / MLU](https://mlu-explain.github.io/neural-networks/) {#resource-051}

対象: 初級〜中級 / 形式: 操作・解説 / 言語: 英語 / 確認: JS・公式目次

ニューラルネットワークの構造を視覚的に導入する単元。Playgroundの実験に説明を添える際に使う。

### 52. [Calculus on Computational Graphs: Backpropagation](https://colah.github.io/posts/2015-08-Backprop/) {#resource-052}

対象: 中級 / 形式: 図解・数式 / 言語: 英語 / 確認: 本文

計算グラフ上の連鎖律と勾配の流れを図で説明する。逆伝播のコードを書く前の概念整理に向く。

### 53. [NNFS Animations](https://nnfs.io/neural_network_animations) {#resource-053}

対象: 初級〜中級 / 形式: アニメーション / 言語: 英語 / 確認: 本文

Neural Networks from Scratchの補助アニメーション。ニューロン、層、計算を映像で補う。書籍は販売物なので無料教材と一括しない。

### 54. [Why Momentum Really Works](https://distill.pub/2017/momentum/) {#resource-054}

対象: 中級〜上級 / 形式: 操作型論文 / 言語: 英語 / 確認: 本文

勾配降下とモーメンタムの働きを、軌跡・幾何学・数式から探る。学習率と収束の授業を深める。

### 55. [Loss Landscape Explorer](https://losslandscape.com/explorer) {#resource-055}

対象: 中級 / 形式: 3D探索 / 言語: 英語 / 確認: JS・公式説明

学習から得た損失地形の低次元可視化を探索する。高次元の重み空間全体を直接表示したものではない。

### 56. [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/) {#resource-056}

対象: 中級 / 形式: 図解 / 言語: 英語 / 確認: 本文

RNNの時間展開とLSTMのゲートを図で解説する。操作型シミュレータではなく、系列モデルの構造を読む補助教材。

## 次元削減・埋め込み・ガウス過程

### 57. [Principal Component Analysis / EV](https://setosa.io/ev/principal-component-analysis/) {#resource-057}

対象: 初級〜中級 / 形式: 操作 / 言語: 英語 / 確認: 本文

2Dの点を動かして主成分の変化を観察し、3Dの射影も比較する。分散を多く残す方向と次元削減をつなげる。

### 58. [Embedding Projector](https://projector.tensorflow.org/) {#resource-058}

対象: 中級 / 形式: データ探索 / 言語: 英語 / 確認: JS・公式紹介

埋め込みを低次元表示で探索するツール。PCA・t-SNEなどの表示から近傍やまとまりを調べる。データ準備の条件は別途確認。

根拠・補足: [公式チュートリアル](https://www.tensorflow.org/tensorboard/tensorboard_projector_plugin)。

### 59. [How to Use t-SNE Effectively](https://distill.pub/2016/misread-tsne/) {#resource-059}

対象: 中級 / 形式: 操作型論文 / 言語: 英語 / 確認: 本文

perplexityや反復数で点群がどう変化するかを比較する。クラスタの大きさや距離を読み違えないための教材。

### 60. [How UMAP Works](https://umap-learn.readthedocs.io/en/latest/how_umap_works.html) {#resource-060}

対象: 中級〜上級 / 形式: 図解・数式 / 言語: 英語 / 確認: 本文

UMAP公式の視覚解説。近傍構造・グラフ・埋め込みを説明する。完成済みブラウザデモではなく図解と実装背景の資料。

### 61. [A Visual Exploration of Gaussian Processes](https://distill.pub/2019/visual-exploration-gaussian-processes/) {#resource-061}

対象: 中級〜上級 / 形式: 操作型論文 / 言語: 英語 / 確認: 本文

カーネルと関数の事前分布・観測後の予測を視覚的に説明する。予測平均だけでなく不確実性を学ぶ。

## 画像処理・CNN・グラフニューラルネットワーク

### 62. [Image Kernels / EV](https://setosa.io/ev/image-kernels/) {#resource-062}

対象: 初級 / 形式: 操作 / 言語: 英語 / 確認: 本文

3×3の積和演算をピクセル単位で追える。ぼかし、輪郭、カスタムカーネルを比較し、CNNの前に画像フィルタを理解する。

### 63. [CNN Explainer](https://poloclub.github.io/cnn-explainer/) {#resource-063}

対象: 初級〜中級 / 形式: 推論可視化 / 言語: 英語 / 確認: JS・公式リポジトリ

画像の入力から畳み込み、ReLU、プーリング、分類までをたどる。学習済みCNNの推論と各層の演算を観察する教材。

根拠・補足: [公式コード・説明](https://github.com/poloclub/cnn-explainer)。

### 64. [TensorSpace](https://tensorspace.org/) {#resource-064}

対象: 中級 / 形式: 3D探索・開発ツール / 言語: 英語・中国語 / 確認: 本文

CNNなどの層と中間出力を3Dで探索する。LeNet、AlexNet、ResNetなどのギャラリーがあり、自作モデル用には変換・準備が必要。

### 65. [Computing Receptive Fields](https://distill.pub/2019/computing-receptive-fields/) {#resource-065}

対象: 中級〜上級 / 形式: 図解・操作型論文 / 言語: 英語 / 確認: 本文

CNNの受容野を図と式で追う。カーネル、stride、層の接続が入力上の範囲をどう変えるかを学ぶ。

### 66. [Deconvolution and Checkerboard Artifacts](https://distill.pub/2016/deconv-checkerboard/) {#resource-066}

対象: 中級 / 形式: 図解・操作型論文 / 言語: 英語 / 確認: 本文

転置畳み込みで格子状のアーティファクトが出る理由を視覚化する。画像生成やアップサンプリングの補助教材。

### 67. [A Gentle Introduction to GNNs](https://distill.pub/2021/gnn-intro/) {#resource-067}

対象: 中級 / 形式: 図解・操作型論文 / 言語: 英語 / 確認: 本文

ノード・エッジ・グラフの表現とメッセージパッシングを視覚的に導入する。CNNや系列モデル以外へ対象を広げる。

### 68. [Vision Transformer Attention Visualization](https://huggingface.co/spaces/webml-community/attention-visualization) {#resource-068}

対象: 中級 / 形式: 推論可視化 / 言語: 英語 / 確認: JS・公式コード

画像上のAttentionを観察するHugging Faceのデモ。公式コードの入口も確認済み。Spaceの画面だけでは推論完了は確認していない。

根拠・補足: [公式サンプルコード](https://github.com/huggingface/transformers.js-examples/tree/main/attention-visualization)。

## 自然言語処理・Transformer・LLM

### 69. [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) {#resource-069}

対象: 初級〜中級 / 形式: ブラウザ推論 / 言語: 英語 / 確認: 本文・公式コード

GPT-2の入力から埋め込み、Attention、MLP、次トークン確率までを追う。温度やサンプリングを変えて生成を比較する。

根拠・補足: [公式コード・説明](https://github.com/poloclub/transformer-explainer)。

### 70. [LLM Visualization](https://bbycroft.net/llm) {#resource-070}

対象: 中級 / 形式: 3D探索 / 言語: 英語 / 確認: JS・公式コード

Brendan BycroftによるGPT型モデルの3Dウォークスルー。行列・層・計算の配置を追い、モデルの規模感を理解する。

根拠・補足: [公式コード・説明](https://github.com/bbycroft/llm-viz)。

### 71. [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) {#resource-071}

対象: 初級〜中級 / 形式: 図解 / 言語: 英語 / 確認: 本文

Jay AlammarによるTransformerの図解。Q・K・Vや多頭Attentionを読むための定番。操作型デモの前提説明として使う。

### 72. [BertViz](https://github.com/jessevig/bertviz) {#resource-072}

対象: 中級〜上級 / 形式: 分析ツール・Notebook / 言語: 英語 / 確認: 本文

Attentionをヘッド・モデル・ニューロンなどの視点で可視化する。自分の入力・モデルに使う場合はNotebook等の準備が必要。

### 73. [exBERT](https://huggingface.co/spaces/exbert-project/exbert) {#resource-073}

対象: 中級〜上級 / 形式: モデル探索 / 言語: 英語 / 確認: JS・公式紹介

文脈表現とAttentionを探索する研究ツール。Spaceの入口と公式紹介を確認したが、サービス内部の実行は未確認。

### 74. [AttentionViz](https://attentionviz.com/) {#resource-074}

対象: 中級〜上級 / 形式: モデル探索 / 言語: 英語 / 確認: JS・公式資料

言語・画像TransformerのQueryとKeyを可視化し、複数のAttentionパターンを俯瞰する。研究者向けの分析にも使う。

根拠・補足: [著者のリポジトリ](https://github.com/catherinesyeh/attention-viz)。

## 生成モデル・強化学習

### 75. [GAN Lab](https://poloclub.github.io/ganlab/) {#resource-075}

対象: 初級〜中級 / 形式: ブラウザ学習 / 言語: 英語 / 確認: 本文

生成器と識別器の学習を2D分布で観察する。ハイパーパラメータ変更、低速再生、ステップ実行で対抗学習を追う。

### 76. [Diffusion Explainer](https://poloclub.github.io/diffusion-explainer/) {#resource-076}

対象: 初級〜中級 / 形式: 操作・生成過程 / 言語: 英語 / 確認: JS・公式コード

用意されたプロンプトでStable Diffusionの構成とノイズ除去過程を観察する。任意のプロンプトを自由生成するサービスとは区別。

根拠・補足: [公式コード・説明](https://github.com/poloclub/diffusion-explainer)。

### 77. [REINFORCEjs](https://cs.stanford.edu/people/karpathy/reinforcejs/) {#resource-077}

対象: 初級〜中級 / 形式: ブラウザ学習 / 言語: 英語 / 確認: 本文

GridWorldの動的計画法・TD学習と、DQNのデモを収録。状態価値、方策、経験からの更新を学ぶ。古い教育用実装。

### 78. [Reinforcement Learning / MLU](https://mlu-explain.github.io/reinforcement-learning/) {#resource-078}

対象: 初級 / 形式: 操作・解説 / 言語: 英語 / 確認: JS・公式目次

強化学習と探索・活用のジレンマを導入する。REINFORCEjsの前に概念をつかむ短い教材。

### 79. [Thompson Sampling / Simon Ward-Jones](https://www.simonwardjones.co.uk/posts/thompson_sampling/) {#resource-079}

対象: 中級 / 形式: 図解・シミュレーション / 言語: 英語 / 確認: 本文

多腕バンディットとベイズ的な行動選択を説明する。推定の不確実性と探索をつなぐ。

### 80. [Contextual Bandits / Simon Ward-Jones](https://www.simonwardjones.co.uk/posts/contextual_bandits/) {#resource-080}

対象: 中級 / 形式: 図解・解説 / 言語: 英語 / 確認: 本文

状況に応じて行動を選ぶ文脈付きバンディットを説明する。単純なバンディットから推薦・意思決定への接続に使う。

## 説明可能AI・バイアス・モデル内部の探索

### 81. [Google PAIR AI Explorables](https://pair.withgoogle.com/explorables/) {#resource-081}

対象: 初級〜中級 / 形式: 操作・解説 / 言語: 英語 / 確認: 本文

公平性、バイアス、モデル解釈などを操作型記事で学ぶ。性能の数値だけでなく、データや評価方法の影響を考える。

### 82. [AI Explorables 日本語翻訳](https://ai-explorables.explorable-explanations.com/) {#resource-082}

対象: 初級〜中級 / 形式: 操作・翻訳 / 言語: 日本語 / 確認: 本文

PAIR教材の有志による日本語翻訳。翻訳された記事の範囲で利用し、公式の日本語版と区別する。

### 83. [Learning Interpretability Tool (LIT)](https://pair-code.github.io/lit/) {#resource-083}

対象: 中級〜上級 / 形式: 分析ツール / 言語: 英語 / 確認: 本文

入力、予測、重要度、埋め込み、モデル間差を比較する。現在の正式名称はLearning Interpretability Tool。自作モデルにはサーバー等の準備が必要。

### 84. [What-If Tool](https://pair-code.github.io/what-if-tool/) {#resource-084}

対象: 中級 / 形式: 分析ツール / 言語: 英語 / 確認: 本文

入力や閾値を変え、予測・特徴量・集団別性能を調べる。デモまたはNotebook連携から利用する分析ツール。

### 85. [Neuronpedia](https://www.neuronpedia.org/) {#resource-085}

対象: 上級 / 形式: 内部表現探索 / 言語: 英語 / 確認: 公式検索・資料

モデル内部の特徴・活性化を検索・可視化する研究プラットフォーム。データ探索と推論・steeringの実行条件を区別する。

根拠・補足: [公式資料](https://docs.neuronpedia.org/)。

### 86. [Activation Atlas](https://distill.pub/2019/activation-atlas/) {#resource-086}

対象: 中級〜上級 / 形式: 操作型論文 / 言語: 英語 / 確認: 本文

画像分類モデルが学んだ特徴を地図のように探索する。内部表現と入力概念の関係を考える。

### 87. [Feature Visualization](https://distill.pub/2017/feature-visualization/) {#resource-087}

対象: 中級〜上級 / 形式: 図解・操作型論文 / 言語: 英語 / 確認: 本文

ニューロン等が反応する特徴を最適化で描く方法の解説。生成された画像をモデルの完全な説明とみなさず読む。

### 88. [Transformer Circuits](https://transformer-circuits.pub/) {#resource-088}

対象: 上級 / 形式: 研究・図解 / 言語: 英語 / 確認: 本文

Transformerの回路や特徴を研究する一次資料集。入門用の操作型教材より専門的だが、内部の可視化と解釈の根拠を追える。

## 実データ・学習ログ・モデル構造を可視化するツール

### 89. [Netron](https://netron.app/) {#resource-089}

対象: 中級 / 形式: モデル構造解析 / 言語: 英語 / 確認: 本文・公式コード

モデルファイルを開いて層、接続、テンソル形状を確認する。構造の可視化であり、学習や推論のシミュレータではない。

### 90. [TensorBoard](https://www.tensorflow.org/tensorboard) {#resource-090}

対象: 中級 / 形式: ログ分析ツール / 言語: 日本語ページあり / 確認: 本文

損失・指標、計算グラフ、ヒストグラム、埋め込みなどを学習ログから表示する。ログ出力と起動の準備が必要。

### 91. [Facets](https://pair-code.github.io/facets/) {#resource-091}

対象: 初級〜中級 / 形式: データ探索 / 言語: 英語 / 確認: 本文

データセットの特徴量分布を比較するOverviewと、個々の事例を探索するDive。学習前の偏りや分布差を調べる。

### 92. [SHAP](https://shap.readthedocs.io/en/latest/) {#resource-092}

対象: 中級〜上級 / 形式: Python分析ツール / 言語: 英語 / 確認: 本文

予測への特徴量の寄与を図で表示する。Pythonで計算・描画する分析ツールで、説明値の前提も学ぶ必要がある。

### 93. [Yellowbrick](https://www.scikit-yb.org/en/latest/) {#resource-093}

対象: 中級 / 形式: Python分析ツール / 言語: 英語 / 確認: 本文

モデル選択・診断のためのPython可視化。分類評価、残差、学習曲線やクラスタ診断を実データ演習に結びつける。

### 94. [Orange Data Mining](https://orangedatamining.com/) {#resource-094}

対象: 初級〜中級 / 形式: GUI分析ソフト / 言語: 英語 / 確認: 本文

GUIで分析の流れをつなぎ、散布図・クラスタリング・分類評価を行う。デスクトップ環境の準備が必要。

### 95. [Teachable Machine](https://teachablemachine.withgoogle.com/) {#resource-095}

対象: 初級 / 形式: 学習実験 / 言語: 多言語 / 確認: JS

画像・音声・ポーズの例を集め、分類モデルを作る実験入口。モデル内部の数式より、データと学習・予測の関係を体験する。

根拠・補足: [公式コード・説明](https://github.com/googlecreativelab/teachablemachine-community)。

## 直接取得できなかった参考候補

次の3件は本編95件とは別の保留リスト。既知の教材としての紹介はあるが、今回の直接アクセスを成功扱いにしていない。取得エラーは公開終了の証拠ではない。

| 教材 | 内容・再確認の理由 | 今回の取得結果 |
| --- | --- | --- |
| [R2D3: A Visual Introduction to Machine Learning](https://www.r2d3.us/visual-intro-to-machine-learning-part-1/) | 決定木を使う視覚的入門。添付資料とML Tokyoの索引から確認できるが、配布前に実画面を再確認したい。 | 522エラー |
| [Visualizing DBSCAN Clustering](https://www.naftaliharris.com/blog/visualizing-dbscan-clustering/) | 密度ベースのクラスタリングの参考候補。現在の画面・操作は未確認。代替はML VisualizationやInteractive MLのDBSCAN単元。 | タイムアウト |
| [Matrix Multiplication](https://matrixmultiplication.xyz/) | 行列積の可視化候補。代替にはImmersive Linear AlgebraやTU Delftの教材がある。 | 502エラー |

## 授業・自習での組み合わせ

### データサイエンス入門

[Seeing Theory](#resource-014)で標本と確率を体験し、[StatKey](#resource-016)で再標本化、[Linear Regression / MLU](#resource-033)で予測へ進む。最後に[Train, Test and Validation / MLU](#resource-041)で学習と評価を分ける。

### 機械学習の基礎

[Decision Trees / MLU](#resource-035) → [Random Forest / MLU](#resource-036) → [Bias-Variance Tradeoff / MLU](#resource-043) → [ROC & AUC / MLU](#resource-046)。分類の仕組み、汎化、評価を一続きで扱う。

### 深層学習

[TensorFlow Playground](#resource-049) → [Calculus on Computational Graphs: Backpropagation](#resource-052) → [Image Kernels / EV](#resource-062) → [CNN Explainer](#resource-063)。最初に学習の挙動を観察し、その後に計算の内訳を読む。

### 自然言語処理・LLM

[Embedding Projector](#resource-058) → [The Illustrated Transformer](#resource-071) → [Transformer Explainer](#resource-069) → [BertViz](#resource-072)。ベクトル表現、構造、推論、Attentionの比較へ進む。BertVizで自作モデルを扱う段階ではNotebook等を準備する。

### 生成AI・責任あるAI

[Diffusion Explainer](#resource-076)で生成過程を見た後、[Google PAIR AI Explorables](#resource-081)でデータ・評価・バイアスを考え、[Learning Interpretability Tool (LIT)](#resource-083)で実モデルの比較に進む。

## 調査方法と未確認事項

1. 添付資料の主要教材と引用先を抽出した。
2. 機械学習・統計の総合索引、研究グループ、大学教材から候補を増やした。
3. 確率統計、線形代数、分類・回帰、最適化、次元削減、画像処理、LLM、生成モデル、強化学習、説明可能AIを分野別に検索した。
4. 各候補の公式ページへアクセスし、JavaScript主体のページは公式コード・論文・目次による補足確認を行った。
5. 同じ教材の紹介記事は独立教材として増やさず、提供元の直リンクを優先した。単元への直リンクは用途が異なるため残した。
6. 直接取得に失敗した候補と、公式検索情報だけの候補を明示した。

確認の主眼は、リンク先の同定、扱う概念、教材と分析ツールの区別、公開ページの取得状況。全機能の実行、教材内の数式・実装の完全な正しさ、全スマートフォンの操作性、利用規約・ライセンスの全件比較は未確認。リンクを紹介することと、スクリーンショット・文章・コードを転載することは別である。

このリンク集自体は、外部スクリプト・トラッカーを使わない静的文書として作成した。公開サイト側のネットワーク利用条件は各サイトに従う。
