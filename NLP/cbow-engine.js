"use strict";

(() => {
  const sessions = new Map();
  let nextSession = 1;

  const zeros = (rows, columns) => Array.from({length: rows}, () => Array(columns).fill(0));
  const copyMatrix = matrix => matrix.map(row => row.slice());
  const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
  const softmax = scores => {
    const maximum = Math.max(...scores);
    const values = scores.map(score => Math.exp(score - maximum));
    const total = values.reduce((sum, value) => sum + value, 0);
    return values.map(value => value / total);
  };

  function seededNormal(seed = 1) {
    let state = seed >>> 0;
    let spare = null;
    const uniform = () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
    return () => {
      if (spare !== null) { const value = spare; spare = null; return value; }
      const radius = Math.sqrt(-2 * Math.log(Math.max(uniform(), 1e-12)));
      const angle = 2 * Math.PI * uniform();
      spare = radius * Math.sin(angle);
      return radius * Math.cos(angle);
    };
  }

  class Experiment {
    constructor(text, hidden) {
      if (typeof text !== "string" || text.length > 4000) throw new Error("文章は4000文字以内で入力");
      if (![2, 3, 5, 8].includes(hidden)) throw new Error("埋め込み次元は2・3・5・8から選択");
      this.text = text.trim().replace(/\s+/g, " ");
      if (!this.text) throw new Error("文章を入力");
      const tokens = this.text.toLowerCase().replace(/\./g, " .").split(/\s+/).filter(Boolean);
      this.vocab = [...new Set(tokens)];
      if (tokens.length < 3 || tokens.length > 160) throw new Error("3〜160語の文章を入力。日本語は語の間を空白で区切る");
      if (this.vocab.length < 2 || this.vocab.length > 24) throw new Error("語彙数は2〜24語。短い例文で比較");
      if (this.vocab.some(word => word.length > 24)) throw new Error("1語は24文字以内。日本語は分かち書きで入力");

      const wordToId = new Map(this.vocab.map((word, id) => [word, id]));
      this.corpus = tokens.map(word => wordToId.get(word));
      this.contexts = [];
      this.targets = [];
      for (let index = 1; index < this.corpus.length - 1; index += 1) {
        this.contexts.push([this.corpus[index - 1], this.corpus[index + 1]]);
        this.targets.push(this.corpus[index]);
      }

      this.hidden = hidden;
      const normal = seededNormal(1);
      this.wIn = Array.from({length: this.vocab.length}, () => Array.from({length: hidden}, () => normal() * 0.01));
      this.wOut = Array.from({length: hidden}, () => Array.from({length: this.vocab.length}, () => normal() * 0.01));
      this.initialIn = copyMatrix(this.wIn);
      this.initialOut = copyMatrix(this.wOut);
      this.epoch = 0;
      this.selected = 0;
      const first = this.forward();
      this.initialProbabilities = first.probabilities.map(row => row.slice());
      this.history = [[0, first.loss]];
    }

    forward() {
      const h = this.contexts.map(([left, right]) => this.wIn[left].map((value, dimension) => (value + this.wIn[right][dimension]) / 2));
      const scores = h.map(row => this.vocab.map((_, word) => this.wOut.reduce((sum, weights, dimension) => sum + row[dimension] * weights[word], 0)));
      const probabilities = scores.map(softmax);
      const loss = probabilities.reduce((sum, row, index) => sum - Math.log(row[this.targets[index]] + 1e-7), 0) / this.targets.length;
      return {h, scores, probabilities, loss};
    }

    gradients(forward) {
      const gradIn = zeros(this.vocab.length, this.hidden);
      const gradOut = zeros(this.hidden, this.vocab.length);
      const batchSize = this.targets.length;
      this.contexts.forEach(([left, right], sample) => {
        const dScore = forward.probabilities[sample].map((value, word) => (value - Number(word === this.targets[sample])) / batchSize);
        for (let dimension = 0; dimension < this.hidden; dimension += 1) {
          for (let word = 0; word < this.vocab.length; word += 1) gradOut[dimension][word] += forward.h[sample][dimension] * dScore[word];
          const dHidden = dot(dScore, this.wOut[dimension]) * 0.5;
          gradIn[left][dimension] += dHidden;
          gradIn[right][dimension] += dHidden;
        }
      });
      return {gradIn, gradOut};
    }

    train(steps, rate) {
      if (!Number.isInteger(steps) || steps < 1 || steps > 100) throw new Error("1回の更新数は1〜100");
      if (!Number.isFinite(rate) || rate < 0.01 || rate > 2) throw new Error("学習率は0.01〜2");
      if (this.epoch + steps > 10000) throw new Error("学習上限10000回。初期化して再実験");
      for (let step = 0; step < steps; step += 1) {
        const gradients = this.gradients(this.forward());
        for (let word = 0; word < this.vocab.length; word += 1) {
          for (let dimension = 0; dimension < this.hidden; dimension += 1) this.wIn[word][dimension] -= rate * gradients.gradIn[word][dimension];
        }
        for (let dimension = 0; dimension < this.hidden; dimension += 1) {
          for (let word = 0; word < this.vocab.length; word += 1) this.wOut[dimension][word] -= rate * gradients.gradOut[dimension][word];
        }
        this.epoch += 1;
        this.history.push([this.epoch, this.forward().loss]);
      }
    }

    snapshot() {
      const forward = this.forward();
      const gradients = this.gradients(forward);
      const selected = this.selected;
      const [left, right] = this.contexts[selected];
      const predictions = forward.probabilities.map(row => row.reduce((best, value, index) => value > row[best] ? index : best, 0));
      const groups = new Map();
      this.contexts.forEach((context, index) => {
        const key = context.slice().sort((a, b) => a - b).join(",");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(index);
      });
      const ambiguous = [...groups.values()].filter(indices => new Set(indices.map(index => this.targets[index])).size > 1);
      const stride = Math.max(1, Math.floor(this.history.length / 500));
      const history = this.history.filter((_, index) => index % stride === 0);
      if (history.at(-1)[0] !== this.epoch) history.push(this.history.at(-1));
      const gradientNorm = Math.sqrt(gradients.gradIn.flat().reduce((sum, value) => sum + value * value, 0));
      return {
        text: this.text, vocab: this.vocab, corpus: this.corpus, contexts: this.contexts, targets: this.targets,
        selected, hidden: this.hidden, epoch: this.epoch, wIn: this.wIn, wOut: this.wOut,
        initialIn: this.initialIn, initialOut: this.initialOut,
        oneHot: [left, right].map(id => this.vocab.map((_, word) => Number(word === id))),
        h0: this.wIn[left], h1: this.wIn[right], h: forward.h[selected], scores: forward.scores[selected],
        probabilities: forward.probabilities[selected], initialProbabilities: this.initialProbabilities[selected],
        predictions, loss: forward.loss,
        sampleLoss: -Math.log(forward.probabilities[selected][this.targets[selected]] + 1e-7),
        accuracy: predictions.filter((prediction, index) => prediction === this.targets[index]).length / this.targets.length,
        history, gradientNorm, ambiguous,
      };
    }
  }

  window.CBOWEngine = {
    async request(path, payload) {
      if (path === "/api/create") {
        const experiment = new Experiment(payload.text, payload.hidden ?? 3);
        const session = String(nextSession++);
        sessions.set(session, experiment);
        return {session, ...experiment.snapshot()};
      }
      const experiment = sessions.get(payload.session);
      if (!experiment) throw new Error("実験が終了した。文章を適用して再開");
      if (path === "/api/train") experiment.train(payload.steps, Number(payload.rate));
      else if (path === "/api/select") {
        if (!Number.isInteger(payload.index) || payload.index < 0 || payload.index >= experiment.targets.length) throw new Error("学習例を選択");
        experiment.selected = payload.index;
      } else throw new Error("未対応の操作");
      return experiment.snapshot();
    },
  };
})();
