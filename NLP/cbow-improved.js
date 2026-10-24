(() => {
  "use strict";
  const C = window.ImprovedCBOW, $ = id => document.getElementById(id);
  const presets = { textbook: "You say goodbye and I say hello.", english: "I like cats. You like dogs. I like dogs.", japanese: "私 は 猫 が 好き 。 私 は 犬 が 好き 。 君 は 猫 が 好き 。" };
  let state, sampleIndex = 0, running = false, timer, active = "embedding";
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = x => (Math.abs(x) < 0.00005 ? 0 : x).toFixed(4);
  const word = id => escape(state.data.words[id]);
  const vector = values => `<div class="vector">${values.map(x => `<b>${fmt(x)}</b>`).join("")}</div>`;
  const table = (headers, rows) => `<table><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
  const row = cells => `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;
  function icons() { if (window.lucide) window.lucide.createIcons(); }
  function options(id, words, selected) {
    $(id).replaceChildren(...words.map((text, i) => {
      const o = document.createElement("option"); o.value = i; o.textContent = text; return o;
    }));
    $(id).value = selected;
  }
  function stop() {
    running = false; clearTimeout(timer);
    $("run").innerHTML = '<i data-lucide="play"></i><span>連続学習</span>'; icons();
  }
  function setup() {
    stop();
    try {
      const next = C.create($("text").value, Number($("dimension").value), Number($("negative-count").value));
      state = next; sampleIndex = 0;
      $("error").hidden = true; $("dirty").hidden = true;
      const { data, h, k } = state, v = data.words.length;
      $("negative-count").value = k;
      // 少語彙の自由入力でも、有効な負例数を選択肢に残す。
      const allowed = [1, 2, 3, 5].filter(n => n < v);
      if (!allowed.includes(k)) allowed.push(k);
      allowed.sort((a, b) => a - b);
      $("negative-count").replaceChildren(...allowed.map(n => new Option(String(n), String(n))));
      $("negative-count").value = k;
      $("token-count").textContent = data.corpus.length;
      $("vocab-count").textContent = v;
      $("sample-count").textContent = `${data.samples.length}組（${data.corpus.length} − 2）`;
      $("shape-in").textContent = `(${v}, ${h})`;
      $("shape-out").textContent = `(${v}, ${h})`;
      options("sample", data.samples.map((_, i) => `${i + 1} / ${data.samples.length}`), 0);
      options("query", data.words, 0);
      render();
    } catch (e) {
      $("error").textContent = e.message; $("error").hidden = false;
    }
  }
  function renderEmbedding() {
    const sample = state.data.samples[sampleIndex], [left, right] = sample.contexts;
    const v = state.data.words.length, h = state.h;
    const onehots = sample.contexts.map(id => Array.from({ length: v }, (_, i) => Number(id === i)));
    $("onehot").innerHTML = sample.contexts.map((id, n) => `<div class="onehot"><b class="${n ? "right" : "left"}">${word(id)}</b>${onehots[n].map(x => `<span class="${x ? `on ${n ? "right" : ""}` : ""}">${x}</span>`).join("")}</div>`).join("");
    $("lookup").innerHTML = sample.contexts.map((id, n) => `<div class="lookup-row"><b class="${n ? "right" : "left"}">${word(id)}：W_in[${id}]</b>${vector(state.ns.input[id])}</div>`).join("");
    $("embedding-matrix").innerHTML = table(["語（ID）", ...Array.from({ length: h }, (_, i) => `成分${i + 1}`)], state.ns.input.map((values, id) => `<tr class="${id === left ? "left-row" : ""} ${id === right ? "right-row" : ""}"><th scope="row">${word(id)} (${id})</th>${values.map(x => `<td>${fmt(x)}</td>`).join("")}</tr>`));
    const dense = Array.from({ length: h }, (_, j) => onehots.reduce((sum, x) => sum + x.reduce((value, hot, id) => value + hot * state.ns.input[id][j], 0), 0) / 2);
    const lookup = C.hidden(state.ns, sample.contexts);
    const difference = Math.max(...dense.map((x, j) => Math.abs(x - lookup[j])));
    $("hidden-equality").innerHTML = `行列積のh ＝ 行参照のh ${vector(lookup)} <span class="positive">最大差 ${difference.toExponential(1)}</span>`;
    $("input-cost").innerHTML = `この例の入力計算：通常の密な積は <b>2 × V × H = ${2 * v * h}</b> 回の乗算、Embeddingは <b>2 × H = ${2 * h}</b> 個の値を参照。その後の平均は共通。<br>ここは同じ重みで計算方法だけを比較するため、両側とも改良モデルの現在のW_inを使う。`;
  }
  function renderSampling() {
    const s = state.data.samples[sampleIndex], full = C.forward(state.full, s);
    const neg = state.displayNegatives[sampleIndex], ns = C.forward(state.ns, s, neg), v = state.data.words.length;
    $("softmax-table").innerHTML = table(["語", "内積s", "P(中心語 | 文脈)"], state.data.words.map((_, id) => row([`<span class="${id === s.target ? "positive" : ""}">${word(id)}${id === s.target ? "（正解）" : ""}</span>`, fmt(full.scores[id]), `<span class="bar-track"><span style="width:${full.probabilities[id] * 100}%"></span></span>${(100 * full.probabilities[id]).toFixed(1)}%`])));
    $("softmax-loss").innerHTML = `L = −log P(${word(s.target)} | 文脈) = <b>${fmt(full.loss)}</b><br><span class="note">全V語の確率を足すと1になる。</span>`;
    $("sampling-table").innerHTML = table(["語／役割", "ラベル", "内積s", "σ(s)", "損失"], ns.candidates.map(c => row([`<span class="${c.label ? "positive" : "negative"}">${word(c.id)}（${c.label ? "正例" : "負例"}）</span>`, c.label, fmt(c.score), fmt(c.probability), fmt(c.loss)])));
    $("sampling-loss").innerHTML = `L = 正例の損失 ＋ 負例${state.k}語の損失 = <b>${fmt(ns.loss)}</b>`;
    const fullCost = v * state.h, sampledCost = (state.k + 1) * state.h;
    $("output-cost").innerHTML = `この1例の出力内積：通常は <b>V × H = ${fullCost}</b> 回の積和、改良は <b>(K + 1) × H = ${sampledCost}</b> 回。${state.k + 1 === v ? "K+1がVと同じなので、この小さな例では内積の計算対象は減らない。" : `${v}語すべてではなく${state.k + 1}語を計算する。`}<br>大語彙の例：V = 1,000,000、H = 100、K = 5なら、100,000,000回 → 600回（内積部分のみ）。重みの保存量は減らない。`;
    const targetMass = state.data.distribution[s.target];
    $("sampling-distribution").innerHTML = table(["語", "出現回数", "回数^0.75", "元の抽出確率", "正解除外後"], state.data.words.map((_, id) => row([word(id), state.data.counts[id], fmt(state.data.counts[id] ** 0.75), fmt(state.data.distribution[id]), id === s.target ? "0（除外）" : fmt(state.data.distribution[id] / (1 - targetMass))])));
  }
  function chart(id, key, color) {
    const canvas = $(id), ratio = window.devicePixelRatio || 1;
    const width = Math.max(200, canvas.getBoundingClientRect().width), height = 124;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext("2d"); ctx.scale(ratio, ratio); ctx.clearRect(0, 0, width, height);
    const points = state.history, max = Math.max(0.01, ...points.map(p => p[key])) * 1.1;
    const left = 38, bottom = height - 23, plotWidth = width - left - 12;
    ctx.font = '11px sans-serif'; ctx.textAlign = "right";
    for (let i = 0; i < 3; i++) {
      const y = 8 + (bottom - 8) * i / 2;
      ctx.strokeStyle = "#d8e3e0"; ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(width - 5, y); ctx.stroke();
      ctx.fillStyle = "#617477"; ctx.fillText((max * (1 - i / 2)).toFixed(2), left - 5, y + 4);
    }
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    points.forEach((p, i) => {
      const x = left + plotWidth * p.epoch / Math.max(1, state.epoch), y = bottom - (bottom - 8) * p[key] / max;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }); ctx.stroke();
    const last = points[points.length - 1];
    ctx.beginPath(); ctx.arc(left + (state.epoch ? plotWidth : 0), bottom - (bottom - 8) * last[key] / max, 3, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = "#617477"; ctx.textAlign = "left"; ctx.fillText("0回", left, height - 5); ctx.textAlign = "right"; ctx.fillText(`${state.epoch}回`, width - 7, height - 5);
  }
  function renderTraining() {
    const last = state.history[state.history.length - 1];
    $("full-mean").textContent = fmt(last.full); $("ns-mean").textContent = fmt(last.ns);
    chart("full-chart", "full", "#2268b5"); chart("ns-chart", "ns", "#087e78");
    const sample = state.data.samples[sampleIndex], negatives = state.displayNegatives[sampleIndex];
    const g = C.gradient(state.ns, sample, negatives);
    const norm = xs => Math.sqrt(C.dot(xs, xs));
    $("gradient-rows").innerHTML = table(["語", "W_inの行", "入力勾配の大きさ", "W_outの行", "出力勾配の大きさ"], state.data.words.map((_, id) => row([word(id), sample.contexts.includes(id) ? '<span class="left">周辺語</span>' : "—", fmt(norm(g.input[id])), id === sample.target ? '<span class="positive">正例</span>' : negatives.includes(id) ? '<span class="negative">負例</span>' : "—", fmt(norm(g.output[id]))])));
  }
  function renderVectors() {
    const model = state[$("vector-model").value], query = Number($("query").value), delta = $("vector-values").value === "delta";
    $("vectors-table").innerHTML = table(["語", ...Array.from({ length: state.h }, (_, j) => `成分${j + 1}`)], model.input.map((values, id) => row([word(id), ...values.map((x, j) => fmt(x - (delta ? state.initial.input[id][j] : 0)))])));
    const neighbors = state.data.words.map((_, id) => ({ id, similarity: C.cosine(model.input[query], model.input[id]) })).filter(n => n.id !== query).sort((a, b) => b.similarity - a.similarity);
    $("neighbors").innerHTML = neighbors.slice(0, 10).map((n, i) => `<div class="neighbor"><span>${i + 1}. ${word(n.id)}</span><b>${fmt(n.similarity)}</b></div>`).join("") + '<p class="note">類似度は表示モードに関係なく、現在のW_inから計算。−1〜1の値で、確率ではない。</p>';
  }
  function render() {
    const s = state.data.samples[sampleIndex];
    $("sample-equation").innerHTML = `<span class="left">${word(s.contexts[0])}</span> ＋ <span class="right">${word(s.contexts[1])}</span> → <span class="positive">${word(s.target)}</span>`;
    $("epoch").textContent = `${state.epoch.toLocaleString()}回`;
    $("sample").value = sampleIndex;
    $("previous").disabled = sampleIndex === 0;
    $("next").disabled = sampleIndex === state.data.samples.length - 1;
    $("step").disabled = running || state.epoch >= 1000;
    $("run").disabled = !running && state.epoch >= 1000;
    if (active === "embedding") renderEmbedding();
    if (active === "sampling") renderSampling();
    if (active === "training") renderTraining();
    if (active === "vectors") renderVectors();
  }
  function step() { C.train(state, Number($("rate").value)); }
  function tick() {
    if (!running) return;
    for (let i = 0; i < 5 && state.epoch < 1000; i++) step();
    if (state.epoch >= 1000) stop();
    render(); if (running) timer = setTimeout(tick, 35);
  }
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => {
    active = button.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach(b => {
      const selected = b.dataset.tab === active;
      b.setAttribute("aria-selected", String(selected)); b.tabIndex = selected ? 0 : -1;
      $(`panel-${b.dataset.tab}`).hidden = !selected;
    }); render(); icons();
  }));
  $("setup").addEventListener("submit", e => { e.preventDefault(); setup(); });
  $("preset").addEventListener("change", () => {
    if (presets[$("preset").value]) $("text").value = presets[$("preset").value];
    // プリセットを変えても学習中のモデルは、適用するまで保持する。
    $("negative-count").replaceChildren(...[1, 2, 3, 5].map(n => new Option(String(n), String(n))));
    $("negative-count").value = 2; $("dirty").hidden = false;
  });
  ["text", "dimension", "negative-count"].forEach(id => $(id).addEventListener("input", () => { $("dirty").hidden = false; if (id === "text") $("preset").value = "custom"; }));
  $("rate").addEventListener("input", () => { $("rate-value").textContent = Number($("rate").value).toFixed(2); });
  $("step").addEventListener("click", () => { step(); render(); });
  $("run").addEventListener("click", () => {
    if (running) { stop(); render(); return; }
    running = true; $("run").innerHTML = '<i data-lucide="pause"></i><span>停止</span>'; icons(); tick();
  });
  $("reset").addEventListener("click", () => {
    stop(); state = C.create(state.data.corpus.map(id => state.data.words[id]).join(" "), state.h, state.k); render();
  });
  $("sample").addEventListener("change", () => { sampleIndex = Number($("sample").value); render(); });
  $("previous").addEventListener("click", () => { sampleIndex--; render(); });
  $("next").addEventListener("click", () => { sampleIndex++; render(); });
  $("resample").addEventListener("click", () => {
    const s = state.data.samples[sampleIndex]; state.displayNegatives[sampleIndex] = C.negatives(state.data, s.target, state.k, state.displayRng); render();
  });
  ["query", "vector-model", "vector-values"].forEach(id => $(id).addEventListener("change", render));
  const tabs = [...document.querySelectorAll("[data-tab]")];
  tabs.forEach((tab, i) => {
    tab.tabIndex = i ? -1 : 0;
    tab.addEventListener("keydown", e => {
      let index;
      if (e.key === "ArrowRight") index = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") index = (i + tabs.length - 1) % tabs.length;
      if (e.key === "Home") index = 0;
      if (e.key === "End") index = tabs.length - 1;
      if (index !== undefined) { e.preventDefault(); tabs[index].click(); tabs[index].focus(); }
    });
  });
  window.addEventListener("resize", () => { if (active === "training") renderTraining(); });
  $("settings-toggle").addEventListener("click", () => {
    const open = $("settings-panel").dataset.open !== "true";
    $("settings-panel").dataset.open = String(open);
    $("settings-toggle").setAttribute("aria-expanded", String(open));
  });
  setup(); icons();
})();
