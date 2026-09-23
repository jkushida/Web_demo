"use strict";
const $ = (id) => document.getElementById(id);
const presets = {
  textbook: "You say goodbye and I say hello.",
  shortEnglish: "You like natural language processing.",
  parallelEnglish: "The cat likes fish. The dog likes bones.",
  japanese: "私 は 猫 が 好き 。 私 は 犬 が 好き 。 君 は 猫 が 好き 。",
  shortJapanese: "私 は 本 を 読む 。 私 は 音楽 を 聴く 。",
  conflict: "you say goodbye you like goodbye you say goodbye you like goodbye",
};
const presetNotes = {
  textbook: "英字は小文字へ変換。ピリオドも1語。",
  shortEnglish: "短い1文から、周辺語と中心語の組を作る。",
  parallelEnglish: "2文に現れる共通の動詞 likes の周辺語を比べる。",
  japanese: "分かち書き済み。形態素解析は行わない。",
  shortJapanese: "分かち書き済みの2文から、学習例を作る。",
  conflict: "同じ周辺語に異なる中心語が対応する例。",
};
let state = null;
let session = null;
let busy = false;
let running = false;
let runLimit = 0;
let activeTab = "data";
const fmt = (x, digits = 3) => Number(x).toFixed(digits);
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icons = () => window.lucide?.createIcons();

function errorMessage(message) {
  $("error").hidden = !message;
  $("error").textContent = message;
}

function syncControls() {
  for (const id of ["step", "reset", "previous", "next", "sample"]) $(id).disabled = !state || busy || running;
  for (const id of ["inference-left", "inference-right"]) $(id).disabled = !state || busy || running;
  $("train").disabled = !state || (busy && !running);
  $("input-form").querySelectorAll("input,button,select,textarea").forEach((el) => el.disabled = busy || running);
  $("rate").disabled = busy || running;
  $("train").innerHTML = running ? '<i data-lucide="pause"></i>停止' : '<i data-lucide="play"></i>連続学習';
  $("status").textContent = running ? "学習中" : busy ? "計算中" : state ? "実験中" : "未接続";
  icons();
}

async function request(path, payload) {
  busy = true;
  syncControls();
  errorMessage("");
  try {
    const result = await window.CBOWEngine.request(path, {session,...payload});
    if (result.session) session = result.session;
    state = result;
    render();
    return true;
  } catch (error) {
    running = false;
    errorMessage(error.message || "計算に失敗");
    return false;
  } finally {
    busy = false;
    syncControls();
  }
}

async function createExperiment(useCurrent = false) {
  running = false;
  const text = useCurrent && state ? state.text : $("text").value;
  const hidden = useCurrent && state ? state.hidden : Number($("hidden").value);
  // A new vocabulary invalidates any word IDs selected for the previous experiment.
  $("inference-left").innerHTML = "";
  $("inference-right").innerHTML = "";
  const ok = await request("/api/create", {text, hidden});
  if (ok) {
    $("text").value = text;
    $("hidden").value = String(hidden);
    $("dirty").hidden = true;
    $("query").value = String(Math.min(2, state.vocab.length - 1));
    renderVectors();
  }
}

async function selectExample(index) {
  if (!state || busy || running) return;
  const length = state.targets.length;
  await request("/api/select", {index:(index + length) % length});
}

async function trainLoop() {
  if (!running || !state) return;
  const steps = Math.min(10, runLimit - state.epoch);
  if (steps <= 0) { running = false; syncControls(); return; }
  const ok = await request("/api/train", {steps,rate:Number($("rate").value)});
  if (ok && running) setTimeout(trainLoop, 30);
}

function setTab(name) {
  activeTab = name;
  document.querySelectorAll("[data-tab]").forEach((button) => {
    const selected = button.dataset.tab === name;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    $(`panel-${button.dataset.tab}`).hidden = !selected;
  });
  if (state) { renderModel(); renderInference(); renderVectors(); renderNetwork(); }
}

function render() {
  renderNetwork();
  const s = state;
  $("vocab-size").textContent = s.vocab.length;
  $("sample-count").textContent = s.targets.length;
  $("sample-count-detail").textContent = s.targets.length;
  $("sample-count-formula").textContent = `${s.corpus.length}トークン − 左右1語 × 2 = ${s.targets.length}組`;
  $("sample-count-reason").textContent = `${s.corpus.length}トークンから、先頭・末尾を除いた${s.targets.length}か所を中心語にする。`;
  $("hidden-size").textContent = s.hidden;
  $("shape-in").textContent = `(${s.vocab.length}, ${s.hidden})`;
  $("shape-out").textContent = `(${s.hidden}, ${s.vocab.length})`;
  $("epoch").textContent = s.epoch.toLocaleString();
  $("mean-loss").textContent = fmt(s.loss,4);
  $("chart-end").textContent = `${s.epoch}回`;
  $("accuracy").textContent = `訓練データ正解率 ${fmt(s.accuracy * 100,1)}%`;
  const [left,right] = s.contexts[s.selected].map((id) => escapeHTML(s.vocab[id]));
  $("sample-equation").innerHTML = `<span class="ctx">${left}</span><span class="op">＋</span><span class="ctx">${right}</span><span class="op">→</span><span class="tgt">${escapeHTML(s.vocab[s.targets[s.selected]])}</span>`;
  $("sample").innerHTML = s.targets.map((_,i) => `<option value="${i}">${i+1} / ${s.targets.length}</option>`).join("");
  $("sample").value = s.selected;
  const previousQuery = $("query").value;
  $("query").innerHTML = s.vocab.map((w,i) => `<option value="${i}">${escapeHTML(w)}</option>`).join("");
  if (previousQuery && Number(previousQuery) < s.vocab.length) $("query").value = previousQuery;
  renderData();
  renderModel();
  renderInference();
  renderVectors();
  drawLoss();
}

function renderData() {
  const s = state;
  const center = s.selected + 1;
  $("tokens").innerHTML = s.corpus.map((id,i) => {
    const role = i === center ? "target" : Math.abs(i-center) === 1 ? "context" : "";
    const disabled = i === 0 || i === s.corpus.length-1;
    return `<button class="token ${role}" data-sample="${i-1}" ${disabled?"disabled":""} title="${disabled?"端の語は左右の文脈がそろわない":`位置${i}を中心語にする`}"><b>${escapeHTML(s.vocab[id])}</b><span>位置 ${i} · ID ${id}</span></button>`;
  }).join("");
  $("corpus").textContent = `[${s.corpus.join(", ")}]`;
  $("vocab-table").innerHTML = `<table><thead><tr><th>単語</th><th>ID</th><th>出現回数</th></tr></thead><tbody>${s.vocab.map((word,id) => `<tr><td>${escapeHTML(word)}</td><td>${id}</td><td>${s.corpus.filter((v)=>v===id).length}</td></tr>`).join("")}</tbody></table>`;
  $("examples-table").innerHTML = `<table><thead><tr><th>例</th><th>左の語</th><th>右の語</th><th>正解</th><th>ID → ID</th></tr></thead><tbody>${s.contexts.map((cs,i) => `<tr class="${i===s.selected?"selected":""}"><td><button class="row-select" data-sample="${i}" aria-label="学習例${i+1}を選択">${i+1}</button></td><td>${escapeHTML(s.vocab[cs[0]])}</td><td>${escapeHTML(s.vocab[cs[1]])}</td><td class="target-text">${escapeHTML(s.vocab[s.targets[i]])}</td><td><code>[${cs}] → ${s.targets[i]}</code></td></tr>`).join("")}</tbody></table>`;
}

function matrixHTML(matrix, rows, columns, highlight = []) {
  const maximum = Math.max(0.00001,...matrix.flat().map(Math.abs));
  return `<table class="matrix-table"><thead><tr><th>語 / 次元</th>${columns.map(c=>`<th>${escapeHTML(c)}</th>`).join("")}</tr></thead><tbody>${matrix.map((row,i)=>`<tr class="${highlight.includes(i)?"highlight":""}"><th>${escapeHTML(rows[i])}</th>${row.map(value=>{
    const alpha = 0.08 + 0.42*Math.abs(value)/maximum;
    const color = value<0?`rgba(190,74,105,${alpha})`:`rgba(36,142,111,${alpha})`;
    return `<td style="background:${color}" title="${value}">${fmt(value)}</td>`;
  }).join("")}</tr>`).join("")}</tbody></table>`;
}

function renderModel() {
  if (!state || activeTab !== "model") return;
  const s = state;
  const selectedIds = s.contexts[s.selected];
  $("one-hot").innerHTML = s.oneHot.map((row,i)=>`<div class="hot-row"><span class="hot-label">${escapeHTML(s.vocab[selectedIds[i]])}<br><code>c${i}</code></span><div class="hot-cells">${row.map((v,j)=>`<span class="hot-cell ${v?"on":""}" title="${escapeHTML(s.vocab[j])} / ID ${j}">${v}</span>`).join("")}</div></div>`).join("");
  $("matrix-shape").textContent = `(${s.vocab.length} × ${s.hidden})`;
  $("lookup-equation").innerHTML = selectedIds.map((id,i)=>`<code>h${i} = c${i} @ W_in = W_in[${id}]</code>`).join("");
  $("input-matrix").innerHTML = matrixHTML(s.wIn,s.vocab,Array.from({length:s.hidden},(_,i)=>`d${i}`),selectedIds);
  $("average-vector").innerHTML = s.h.map((value)=>`<span title="${value}">${fmt(value,4)}</span>`).join("");
  const target = s.targets[s.selected];
  $("probabilities").innerHTML = s.probabilities.map((p,i)=>`<div class="prob-row ${i===target?"answer":""}"><span class="prob-word">${escapeHTML(s.vocab[i])}${i===target?" *":""}</span><div class="bar-track" title="score = ${fmt(s.scores[i],5)}"><div class="bar-fill" style="width:${p*100}%"></div><span class="initial-mark" style="left:${s.initialProbabilities[i]*100}%"></span></div><span class="percent">${fmt(p*100,1)}%</span></div>`).join("");
  const predicted = s.predictions[s.selected];
  $("prediction-result").innerHTML = `予測 <strong>${escapeHTML(s.vocab[predicted])}</strong><br>正解 * ${escapeHTML(s.vocab[target])} · 確率の合計 ${fmt(s.probabilities.reduce((a,b)=>a+b,0),4)}`;
  $("sample-loss").textContent = fmt(s.sampleLoss,4);
  $("output-matrix").innerHTML = matrixHTML(s.wOut,Array.from({length:s.hidden},(_,i)=>`d${i}`),s.vocab);
  const group = s.ambiguous.find((indices)=>indices.includes(s.selected));
  $("ambiguity").hidden = !group;
  if (group) {
    const targets = [...new Set(group.map(i=>s.vocab[s.targets[i]]))];
    $("ambiguity").textContent = `同じ周辺語の組に、異なる正解「${targets.join("」「")}」がある。平均を取るCBOWは左右の順序を区別せず、これらには同じ予測確率を出す。`;
  }
}

function renderInference() {
  if (!state) return;
  const s = state;
  const leftSelect = $("inference-left");
  const rightSelect = $("inference-right");
  const fallback = s.contexts[s.selected];
  const selectedId = (select) => {
    const id = Number(select.value);
    const option = select.options[select.selectedIndex];
    return option && option.textContent === `${s.vocab[id]}（ID ${id}）` ? id : NaN;
  };
  const selectedLeft = selectedId(leftSelect);
  const selectedRight = selectedId(rightSelect);
  const leftId = Number.isInteger(selectedLeft) && selectedLeft >= 0 && selectedLeft < s.vocab.length ? selectedLeft : fallback[0];
  const rightId = Number.isInteger(selectedRight) && selectedRight >= 0 && selectedRight < s.vocab.length ? selectedRight : fallback[1];
  const options = (selected) => s.vocab.map((word, id) => `<option value="${id}" ${id === selected ? "selected" : ""}>${escapeHTML(word)}（ID ${id}）</option>`).join("");
  leftSelect.innerHTML = options(leftId);
  rightSelect.innerHTML = options(rightId);

  const hidden = s.wIn[leftId].map((value, dimension) => (value + s.wIn[rightId][dimension]) / 2);
  const scores = s.vocab.map((_, wordId) => hidden.reduce((sum, value, dimension) => sum + value * s.wOut[dimension][wordId], 0));
  const maximumScore = Math.max(...scores);
  const expScores = scores.map((score) => Math.exp(score - maximumScore));
  const total = expScores.reduce((sum, value) => sum + value, 0);
  const probabilities = expScores.map((value) => value / total);
  const predictedId = probabilities.reduce((best, value, id) => value > probabilities[best] ? id : best, 0);
  $("inference-equation").innerHTML = `<span class="ctx">${escapeHTML(s.vocab[leftId])}</span><span class="op">＋</span><span class="ctx">${escapeHTML(s.vocab[rightId])}</span>`;
  $("inference-hidden").innerHTML = hidden.map((value) => `<span title="${value}">${fmt(value, 4)}</span>`).join("");
  $("inference-probabilities").innerHTML = probabilities.map((probability, id) => `<div class="prob-row ${id === predictedId ? "inference-answer" : ""}"><span class="prob-word">${escapeHTML(s.vocab[id])}</span><div class="bar-track" title="score = ${fmt(scores[id], 5)}"><div class="bar-fill" style="width:${probability * 100}%"></div></div><span class="percent">${fmt(probability * 100, 1)}%</span></div>`).join("");
  $("inference-result").innerHTML = `最も確率が高い中心語: <strong>${escapeHTML(s.vocab[predictedId])}</strong> <span>${fmt(probabilities[predictedId] * 100, 1)}%</span>`;

  const sameInputExamples = s.contexts.map((context, index) => ({context, index})).filter(({context}) => context.slice().sort((a, b) => a - b).join(",") === [leftId, rightId].sort((a, b) => a - b).join(","));
  const differentTargets = [...new Set(sameInputExamples.map(({index}) => s.targets[index]))];
  const note = $("window-note");
  if (differentTargets.length > 1) {
    const targetCounts = differentTargets.map((id) => ({
      id,
      count: sameInputExamples.filter(({index}) => s.targets[index] === id).length,
    }));
    const countSummary = targetCounts.map(({id, count}) => `「${escapeHTML(s.vocab[id])}」${count}回`).join("、");
    const ratioSummary = targetCounts.map(({id, count}) => `「${escapeHTML(s.vocab[id])}」を約${count}/${sameInputExamples.length}`).join("、");
    const conflictDetail = s.text === presets.conflict ? " 前後2語へ広げても、この反復文では <code>like</code> と <code>say</code> の周辺語がともに <code>[goodbye, you, goodbye, you]</code> になる。前後3語ならこの例では区別できるが、通常CBOWは語順を平均で失うため、一般的な解決策ではない。" : "";
    note.innerHTML = `この周辺語の組の正解は、学習データ内で${countSummary}。どの文の周辺語かを示す情報は入力にないため、通常CBOWは同じ入力から1つの確率分布しか出せない。学習が進むと、${ratioSummary}とする1回の予測になる。${conflictDetail}`;
    note.hidden = false;
  } else {
    note.hidden = true;
    note.textContent = "";
  }
}

function renderVectors() {
  if (!state || activeTab !== "vectors") return;
  const s = state;
  const mode = $("vector-mode").value;
  const matrix = mode === "initial" ? s.initialIn : mode === "delta" ? s.wIn.map((row,i)=>row.map((v,j)=>v-s.initialIn[i][j])) : s.wIn;
  const query = Number($("query").value);
  $("vectors-table").innerHTML = matrixHTML(matrix,s.vocab,Array.from({length:s.hidden},(_,i)=>`d${i}`),[query]);
  const norm = (vector)=>Math.sqrt(vector.reduce((sum,v)=>sum+v*v,0));
  const q = s.wIn[query];
  const scores = s.wIn.map((row,i)=>({i,value:row.reduce((sum,v,j)=>sum+v*q[j],0)/(norm(q)*norm(row)+1e-12)})).filter(row=>row.i!==query).sort((a,b)=>b.value-a.value);
  $("similarities").innerHTML = scores.slice(0,7).map(row=>`<div class="sim-row"><span>${escapeHTML(s.vocab[row.i])}</span><strong>${row.value>=0?"+":""}${fmt(row.value,4)}</strong></div>`).join("");
}

function drawLoss() {
  if (!state) return;
  const canvas = $("loss-chart");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width*ratio);
  canvas.height = Math.round(height*ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio,ratio);
  const max = Math.max(0.1,...state.history.map(pair=>pair[1]))*1.08;
  ctx.strokeStyle = "#dde4df";
  ctx.lineWidth = 1;
  [0,0.5,1].forEach(f=>{ctx.beginPath();ctx.moveTo(0,8+f*(height-16));ctx.lineTo(width,8+f*(height-16));ctx.stroke();});
  ctx.strokeStyle = "#b83f58";
  ctx.lineWidth = 2;
  ctx.beginPath();
  state.history.forEach(([epoch,loss],i)=>{
    const x = 2 + epoch/Math.max(1,state.epoch)*(width-4);
    const y = height-8-loss/max*(height-16);
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  const last = state.history[state.history.length-1];
  ctx.fillStyle = "#b83f58";
  ctx.beginPath();ctx.arc(2+last[0]/Math.max(1,state.epoch)*(width-4),height-8-last[1]/max*(height-16),3,0,Math.PI*2);ctx.fill();
  canvas.setAttribute("aria-label",`平均損失: 初期 ${fmt(state.history[0][1],4)}、${state.epoch}回更新後 ${fmt(state.loss,4)}`);
}

$("input-form").addEventListener("submit",(event)=>{event.preventDefault();if(!busy&&!running) createExperiment();});
$("preset").addEventListener("change",()=>{
  if (presets[$("preset").value]) $("text").value = presets[$("preset").value];
  $("input-note").textContent = presetNotes[$("preset").value] || "入力した文章から学習例を作る。";
  $("dirty").hidden = false;
});
$("text").addEventListener("input",()=>{$("preset").value="custom";$("dirty").hidden=false;});
$("hidden").addEventListener("change",()=>$("dirty").hidden=false);
$("rate").addEventListener("input",()=>$("rate-value").textContent=fmt($("rate").value,2));
$("reset").addEventListener("click",()=>{if(!busy&&!running) createExperiment(true);});
$("step").addEventListener("click",()=>{if(!busy&&!running) request("/api/train",{steps:1,rate:Number($("rate").value)});});
$("train").addEventListener("click",()=>{
  if (running) {running=false;syncControls();return;}
  if (busy || !state) return;
  running=true;runLimit=Math.min(10000,state.epoch+1000);syncControls();trainLoop();
});
$("previous").addEventListener("click",()=>selectExample(state.selected-1));
$("next").addEventListener("click",()=>selectExample(state.selected+1));
$("sample").addEventListener("change",()=>selectExample(Number($("sample").value)));
document.addEventListener("click",(event)=>{
  const token = event.target.closest("[data-sample]");
  if (token) selectExample(Number(token.dataset.sample));
  const tab = event.target.closest("[data-tab]");
  if (tab) setTab(tab.dataset.tab);

});
$("query").addEventListener("change",renderVectors);
$("vector-mode").addEventListener("change",renderVectors);
$("inference-left").addEventListener("change",renderInference);
$("inference-right").addEventListener("change",renderInference);
document.querySelector(".tabs").addEventListener("keydown",(event)=>{
  if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
  const tabs=[...document.querySelectorAll("[data-tab]")];
  let index=tabs.findIndex(t=>t.dataset.tab===activeTab);
  index=event.key==="Home"?0:event.key==="End"?tabs.length-1:(index+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
  event.preventDefault();setTab(tabs[index].dataset.tab);tabs[index].focus();
});
window.addEventListener("resize",drawLoss);
$("settings-toggle").addEventListener("click",()=>{
  const open=document.body.classList.toggle("settings-open");
  $("settings-toggle").setAttribute("aria-expanded",String(open));
  drawLoss();
});
const networkTab = document.createElement("button");
networkTab.id = "tab-network";
networkTab.dataset.tab = "network";
networkTab.textContent = "ネットワーク図";
networkTab.setAttribute("role", "tab");
networkTab.setAttribute("aria-controls", "panel-network");
networkTab.setAttribute("aria-selected", "false");
document.querySelector(".tabs").appendChild(networkTab);
icons();
setTab("data");
createExperiment();

function renderNetwork() {
  if (!state) return;
  const s = state, v = s.vocab.length, h = s.hidden;
  const row = 38, block = v * row + 20, height = block * 2 + 170;
  const mid = height / 2, leftTop = 65, rightTop = block + 100;
  const outTop = mid - (v - 1) * row / 2;
  const hiddenTop = mid - (h - 1) * row / 2;
  const svg = $("network-svg");
  svg.setAttribute("viewBox", `0 0 1260 ${height}`);
  let parts = [];
  const text = (x,y,value,size=17,color="#233b38",anchor="middle") => parts.push(`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${color}">${escapeHTML(value)}</text>`);
  const line = (x1,y1,x2,y2,color="#bacac6") => parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}"/>`);
  const circle = (x,y,value,active=false) => {parts.push(`<circle cx="${x}" cy="${y}" r="18" fill="${active?"#fbe8ed":"#eff5f2"}" stroke="${active?"#bb405f":"#9ab2a9"}"/>`);text(x,y+5,value,12);};
  // Lines are behind the node values. Each input branch shares the same W_in.
  for (const top of [leftTop,rightTop]) for(let i=0;i<v;i++) for(let j=0;j<h;j++) line(210,top+i*row,440,hiddenTop+j*row);
  for(let j=0;j<h;j++) for(let i=0;i<v;i++) line(458,hiddenTop+j*row,650,outTop+i*row);
  for(let i=0;i<v;i++) {line(870,outTop+i*row,1010,outTop+i*row);}
  for(const [branch,top] of [[0,leftTop],[1,rightTop]]) {
    for(let i=0;i<v;i++) {text(163,top+i*row+5,s.vocab[i],15,i===s.contexts[s.selected][branch]?"#087e79":"#53635e","end");circle(192,top+i*row,s.oneHot[branch][i],i===s.contexts[s.selected][branch]);}
    text(300,top+(v-1)*row/2-12,"W_in",24);text(300,top+(v-1)*row/2+12,`${v} × ${h}`,15);
  }
  for(let j=0;j<h;j++)circle(440,hiddenTop+j*row,fmt(s.h[j],3));
  for(let i=0;i<v;i++) {circle(668,outTop+i*row,fmt(s.scores[i],2));circle(860,outTop+i*row,fmt(s.probabilities[i],3),i===s.targets[s.selected]);text(1020,outTop+i*row+5,s.vocab[i],15,"#53635e","start");circle(1190,outTop+i*row,Number(i===s.targets[s.selected]),i===s.targets[s.selected]);}
  text(555,mid-42,"W_out",24);text(555,mid-18,`${h} × ${v}`,15);
  text(762,mid-25,"Softmax",20);text(762,mid+13,"→",36);
  text(192,height-30,"入力層：左右の周辺語");
  text(440,hiddenTop+h*row+15,"中間層 h");text(440,hiddenTop+h*row+40,"(左 + 右) / 2",15);
  text(668,outTop+v*row+15,"スコア");text(860,outTop+v*row+15,"予測確率");text(1190,outTop+v*row+15,"正解ラベル");
  text(965,outTop+v*row+65,`交差エントロピー損失 = ${fmt(s.sampleLoss,4)}`,18,"#bb405f");
  svg.innerHTML = parts.join("");
}
