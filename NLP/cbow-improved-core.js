/* 同じ初期値でSoftmaxとNegative Samplingを比較する、小規模な全件SGD。 */
(function (root) {
  "use strict";
  const zeros = (v, h) => Array.from({ length: v }, () => Array(h).fill(0));
  const clone = matrix => matrix.map(row => row.slice());
  const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
  const sigmoid = x => x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
  const softplus = x => Math.max(0, x) + Math.log1p(Math.exp(-Math.abs(x)));
  function random(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function prepare(text) {
    const tokens = text.toLowerCase().replace(/([.!?。！？])/gu, " $1 ").trim().split(/\s+/u).filter(Boolean);
    if (tokens.length < 3 || tokens.length > 100) throw new Error("コーパスは3〜100トークンにしてください。");
    if (tokens.some(word => word.length > 40)) throw new Error("1語は40文字以内にしてください。");
    const words = [], counts = [], ids = new Map();
    const corpus = tokens.map(word => {
      if (!ids.has(word)) { ids.set(word, words.length); words.push(word); counts.push(0); }
      const id = ids.get(word); counts[id]++; return id;
    });
    if (words.length < 2) throw new Error("負例を選ぶため、異なる語が2種類以上必要です。");
    const samples = corpus.slice(1, -1).map((target, i) => ({ contexts: [corpus[i], corpus[i + 2]], target }));
    const mass = counts.map(n => n ** 0.75), total = mass.reduce((a, b) => a + b, 0);
    return { words, counts, corpus, samples, distribution: mass.map(n => n / total) };
  }
  function negatives(data, target, k, rng) {
    const weights = data.distribution.map((p, id) => id === target ? 0 : p), result = [];
    for (let n = 0; n < k; n++) {
      let r = rng() * weights.reduce((a, b) => a + b, 0), chosen = -1;
      for (let id = 0; id < weights.length; id++) {
        if (weights[id] > 0) { chosen = id; r -= weights[id]; if (r < 0) break; }
      }
      result.push(chosen); weights[chosen] = 0;
    }
    return result;
  }
  function hidden(model, contexts) {
    return model.input[0].map((_, j) => contexts.reduce((sum, id) => sum + model.input[id][j], 0) / contexts.length);
  }
  function forward(model, sample, negativeIds) {
    const h = hidden(model, sample.contexts);
    if (negativeIds === undefined) {
      const scores = model.output.map(u => dot(h, u)), max = Math.max(...scores);
      const exps = scores.map(s => Math.exp(s - max)), sum = exps.reduce((a, b) => a + b, 0);
      return { h, scores, probabilities: exps.map(e => e / sum), loss: max + Math.log(sum) - scores[sample.target] };
    }
    const candidates = [sample.target, ...negativeIds].map((id, i) => {
      const label = i === 0 ? 1 : 0, score = dot(h, model.output[id]);
      return { id, label, score, probability: sigmoid(score), loss: softplus(score) - label * score };
    });
    return { h, candidates, loss: candidates.reduce((sum, c) => sum + c.loss, 0) };
  }
  function gradient(model, sample, negativeIds) {
    const v = model.input.length, hsize = model.input[0].length;
    const input = zeros(v, hsize), output = zeros(v, hsize), dh = Array(hsize).fill(0);
    const result = forward(model, sample, negativeIds);
    const candidates = negativeIds === undefined
      ? result.probabilities.map((p, id) => ({ id, delta: p - Number(id === sample.target) }))
      : result.candidates.map(c => ({ id: c.id, delta: c.probability - c.label }));
    for (const c of candidates) {
      for (let j = 0; j < hsize; j++) {
        output[c.id][j] += c.delta * result.h[j];
        dh[j] += c.delta * model.output[c.id][j];
      }
    }
    // 同じ文脈IDが左右で使われる場合も、同じ行へ両方の勾配を加算する。
    for (const id of sample.contexts) for (let j = 0; j < hsize; j++) input[id][j] += dh[j] / sample.contexts.length;
    return { input, output, loss: result.loss };
  }
  function update(model, samples, rate, negativeSets) {
    const v = model.input.length, h = model.input[0].length;
    const input = zeros(v, h), output = zeros(v, h);
    samples.forEach((sample, i) => {
      const g = gradient(model, sample, negativeSets && negativeSets[i]);
      for (let id = 0; id < v; id++) for (let j = 0; j < h; j++) {
        input[id][j] += g.input[id][j] / samples.length;
        output[id][j] += g.output[id][j] / samples.length;
      }
    });
    for (let id = 0; id < v; id++) for (let j = 0; j < h; j++) {
      model.input[id][j] -= rate * input[id][j];
      model.output[id][j] -= rate * output[id][j];
    }
  }
  function create(text, h, requestedK) {
    const data = prepare(text), v = data.words.length, k = Math.min(requestedK, v - 1), rng = random(20261003);
    function weights() {
      return Array.from({ length: v }, () => Array.from({ length: h }, () => {
        const u = Math.max(rng(), 1e-10);
        return 0.01 * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
      }));
    }
    const initial = { input: weights(), output: weights() };
    const copy = () => ({ input: clone(initial.input), output: clone(initial.output) });
    const evalRng = random(100), displayRng = random(200), trainingRng = random(300);
    const state = { data, h, k, initial, full: copy(), ns: copy(), epoch: 0, history: [],
      evaluationNegatives: data.samples.map(s => negatives(data, s.target, k, evalRng)),
      displayNegatives: data.samples.map(s => negatives(data, s.target, k, displayRng)), trainingRng, displayRng };
    evaluate(state); return state;
  }
  function evaluate(state) {
    const samples = state.data.samples;
    const full = samples.reduce((sum, s) => sum + forward(state.full, s).loss, 0) / samples.length;
    const ns = samples.reduce((sum, s, i) => sum + forward(state.ns, s, state.evaluationNegatives[i]).loss, 0) / samples.length;
    state.history.push({ epoch: state.epoch, full, ns });
    return { full, ns };
  }
  function train(state, rate) {
    const negativeSets = state.data.samples.map(s => negatives(state.data, s.target, state.k, state.trainingRng));
    update(state.full, state.data.samples, rate);
    update(state.ns, state.data.samples, rate, negativeSets);
    state.epoch++; evaluate(state);
  }
  function cosine(a, b) {
    const denom = Math.sqrt(dot(a, a) * dot(b, b));
    return denom ? dot(a, b) / denom : 0;
  }
  const api = { create, train, prepare, negatives, random, hidden, forward, gradient, cosine, dot };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ImprovedCBOW = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
