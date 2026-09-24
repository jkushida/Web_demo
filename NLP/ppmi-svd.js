'use strict';
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const examples = {textbook:'You say goodbye and I say hello.',two:'I like music. You like movies.',repeatEnglish:'I like music. I like movies. I like music.',jp:'私 は 猫 が 好き 。 私 は 犬 が 好き 。 君 は 猫 が 好き 。',repeat:'a a b a a b a a c a a c'};
const names = ['共起行列','出現確率','PMI','PPMI','SVD','散布図','類似語比較'];
let state, stage = 0, row = 0, col = 1;
const fmt = n => n === -Infinity ? '−∞' : Math.abs(n) < 1e-10 ? '0' : n.toFixed(3);
function compute(text, width) {
  const tokens = text.toLowerCase().replace(/([.、。])/g,' $1 ').trim().split(/\s+/).filter(Boolean);
  const words = [...new Set(tokens)];
  if (tokens.length < 2 || tokens.length > 120 || words.length > 25 || words.some(w => w.length > 30)) throw Error('2〜120トークン、25語彙以内、1語30文字以内で入力する。');
  const ids = new Map(words.map((w,i) => [w,i]));
  const C = words.map(() => words.map(() => 0));
  tokens.forEach((word,i) => {for(let d=1;d<=width;d++) for(const j of [i-d,i+d]) if(j>=0 && j<tokens.length) C[ids.get(word)][ids.get(tokens[j])]++;});
  const rows = C.map(r=>r.reduce((a,b)=>a+b,0));
  const cols = words.map((_,j)=>C.reduce((s,r)=>s+r[j],0));
  const N = rows.reduce((a,b)=>a+b,0);
  const PMI = C.map((r,i)=>r.map((c,j)=>c ? Math.log2(c*N/(rows[i]*cols[j])) : -Infinity));
  const M = PMI.map(r=>r.map(v=>Math.max(0,v)));
  // SVD is generated with NumPy; counts and PMI are calculated live.
  const svd = PPMI_SVD_DATA[JSON.stringify([tokens,width])];
  if(!svd)throw Error('この文章のSVDデータは未収録。例文から選択する。');
  return {tokens,words,C,rows,cols,N,PMI,M,...svd};
}
function apply() {
  try {
    const next = compute($('text').value,Number($('window').value));
    state = next; row = 0; col = Math.min(1,state.words.length-1);
    $('dimension').innerHTML = state.words.map((_,i)=>`<option value="${i+1}">${i+1}次元</option>`).join('');
    $('dimension').value = String(Math.min(2,state.words.length));
    $('query').innerHTML = state.words.map((w,i)=>`<option value="${i}">${esc(w)}</option>`).join('');
    $('tokens').textContent = state.tokens.length; $('vocab').textContent = state.words.length; $('total').textContent = state.N;
    $('error').hidden = true; $('dirty').hidden = true; render();
  } catch(e) { $('error').textContent = e.message; $('error').hidden = false; }
}
function table(matrix, interactive = true, headers = state.words) {
  const max = Math.max(1,...matrix.flat().filter(Number.isFinite).map(Math.abs));
  const show = value => stage === 0 ? String(value) : fmt(value);
  return `<div class="scroll"><table><thead><tr><th>行 ＼ 列</th>${headers.map(w=>`<th>${esc(w)}</th>`).join('')}</tr></thead><tbody>${matrix.map((r,i)=>`<tr><th>${esc(state.words[i])}</th>${r.map((v,j)=>`<td>${interactive?`<button data-cell="${i},${j}" class="${i===row&&j===col?'selected':''}" aria-label="${esc(state.words[i])}と${esc(state.words[j])}: ${show(v)}" style="background:${v<0?'rgba(173,56,86,':'rgba(8,126,121,'}${Number.isFinite(v)?0.04+Math.abs(v)/max*.26:'.08'})">${show(v)}</button>`:show(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function cellExplanation() {
  const s=state, c=s.C[row][col], a=s.rows[row], b=s.cols[col];
  const expected=a*b/s.N, p=s.PMI[row][col];
  const mark = (role, value, label) => `<span class="quantity q-${role}" title="${label}">${esc(value)}</span>`;
  const count = mark('count', c, '共起回数 C[x,y]'), rsum = mark('row', a, '行和：注目語側'), csum = mark('col', b, '列和：周辺語側'), total = mark('total', s.N, '共起ペア総数 N');
  const result = value => mark('result', fmt(value), '計算結果');
  const pairSelectors=stage===1?`<div class="pair-selectors"><label for="pair-row">注目語 x<select id="pair-row" data-pair-row>${s.words.map((word,i)=>`<option value="${i}" ${i===row?'selected':''}>${esc(word)}</option>`).join('')}</select></label><label for="pair-col">周辺語 y<select id="pair-col" data-pair-col>${s.words.map((word,i)=>`<option value="${i}" ${i===col?'selected':''}>${esc(word)}</option>`).join('')}</select></label></div>`:'';
  return `<div class="formula">${pairSelectors}<h3><span class="q-row">${esc(s.words[row])}</span> × <span class="q-col">${esc(s.words[col])}</span></h3>
    <div class="quantity-legend" aria-label="数値の色と役割"><span class="q-count">共起回数</span><span class="q-row">行和</span><span class="q-col">列和</span><span class="q-total">総数 N</span><span class="q-result">計算結果</span></div>
    <p>共起回数 C[x,y] = ${count}</p><p>行和 = ${rsum} ／ 列和 = ${csum} ／ N = ${total}</p>
    <p>P(x,y) = ${count}/${total} = ${result(c/s.N)}</p>
    <p>P(x)P(y) = (${rsum}/${total}) × (${csum}/${total}) = ${result(a*b/s.N**2)}</p>
    <p>独立なら期待される回数 = ${result(expected)}</p><hr>
    <p>PMI = log₂((${count} × ${total}) / (${rsum} × ${csum}))</p><p class="value">${result(p)}</p>
    <p>PPMI = max(0, ${result(p)}) = ${result(Math.max(0,p))}</p>
    <p>${c===0?'共起0回なのでPMIは−∞、PPMIは0。':p>0?'独立と仮定した期待回数より多く共起している。':p<0?'独立と仮定した期待回数より少なく共起している。':'独立と仮定した期待回数と一致する。'}</p></div>`;
}
function pairCountWalk() {
  const s=state, entries=[];
  s.tokens.forEach((word,i)=>{
    for(let d=1;d<=Number($('window').value);d++) for(const j of [i-d,i+d]) if(j>=0&&j<s.tokens.length) entries.push({i,j,word,neighbor:s.tokens[j]});
  });
  const tokens=s.tokens.map((word,i)=>`<span class="token-position"><small>${i+1}</small>${esc(word)}</span>`).join('');
  const rows=entries.map((e,i)=>`<tr><td>${i+1}</td><td>${e.i+1}</td><td><b>${esc(e.word)}</b> → ${esc(e.neighbor)} <small>(位置 ${e.j+1})</small></td><td>C[${esc(e.word)}, ${esc(e.neighbor)}] に +1</td></tr>`).join('');
  const gaps=entries.length/2;
  return `<section class="pair-walk"><h3>どの語の組を数えたか</h3><p>コーパスを左から位置番号で示す。各位置の語を注目語にし、左右の幅 ${$('window').value} 語以内にある語を周辺語として、対応する行列セルに1を加える。</p><div class="token-line" aria-label="位置番号付きコーパス">${tokens}</div><p><b>${s.tokens.length}語</b>の列から、文脈内の組を<b>${entries.length}回</b>数える。各組は「注目語 → 周辺語」の向きで1回ずつ記録する。</p><details open><summary>加算記録をすべて表示（${entries.length}回）</summary><div class="scroll pair-scroll"><table><thead><tr><th>加算順</th><th>注目位置</th><th>注目語 → 周辺語</th><th>増える行列セル</th></tr></thead><tbody>${rows}</tbody></table></div></details><p class="note">行列の全セルを合計：${entries.length}回の加算で N = ${s.N}。対称な文脈窓では、同じ隣接箇所も注目語を逆にして数えるため、${gaps}箇所 × 2方向 = ${entries.length}回。句点を含めて1列にしているので、文の境界もまたいで集計する。</p></section>`;
}
function cosine(a,b) {const den=Math.hypot(...a)*Math.hypot(...b);return den<1e-12?null:a.reduce((v,x,i)=>v+x*b[i],0)/den;}
function render() {
  if(!state)return;
  const s=state, k=Number($('dimension').value), q=Number($('query').value), reduced=s.U.map(r=>r.slice(0,k));
  document.querySelectorAll('[role=tab]').forEach((b,i)=>{b.setAttribute('aria-selected',String(stage===i));b.tabIndex=stage===i?0:-1;});
  $('panel').setAttribute('aria-labelledby',`tab-${stage}`);
  $('title').textContent = ['共起行列 C の生成','共起ペアを確率に変える','期待される共起と実際の共起を比べる','PMIの負の値を0にする','PPMIを少ない成分で近似する','単語ベクトルUの先頭2成分','表現を変えたときの近い語'][stage];
  $('lead').textContent = ['セルを選ぶと、同じ語の組を確率・PMI・PPMIまで追跡できる。','N個の共起ペアから1組を選ぶとき、注目語がxである確率をP(x)とする。','PMIが正なら、独立と仮定した場合より多く共起している。','0を含む疎な行列はまだ語彙数V次元。次にSVDで次元を減らす。',`単語1つを${s.words.length}成分から${k}成分へ。教科書と同じUₖを使用。`,'点を選ぶと基準語が変わる。軸の符号や向き自体に意味はない。',`基準語「${s.words[q]}」を除外して比較。SVDは${k}次元を使用。`][stage];
  if(stage>=4 && s.S[0]<1e-12) {
    $('content').innerHTML='<div class="formula"><h3>PPMI行列が全て0</h3><p>共起の正の関連が残っていないため、SVDの軸から単語の関係を読み取れない。別の文章で比較する。</p></div>';
    $('previous').disabled=false; $('next').disabled=stage===6; $('step-count').textContent=`${stage+1} / 7`;
    return;
  }
  if(stage===0 || stage===2 || stage===3) {
    const matrix=stage===0?s.C:stage===2?s.PMI:s.M;
    const matrixValues=stage===0?s.C.flat():[];
    const totalCells=matrixValues.length;
    const valueCounts=matrixValues.reduce((counts,value)=>counts.set(value,(counts.get(value)||0)+1),new Map());
    const matrixTotal=valueCounts.size?[...valueCounts].sort(([a],[b])=>a-b).map(([value,count])=>`${value}×${count}`).join(' + '):'';
    const matrixGuide=stage===0?`<div class="matrix-guide"><b>C[i,j] は「注目語 i と周辺語 j」の組を数えた1セル</b><span>行列の大きさ：${s.words.length}×${s.words.length} = ${totalCells}セル</span><span>セルの値ごとの内訳：${[...valueCounts].sort(([a],[b])=>a-b).map(([value,count])=>`${value}のセル ${count}個`).join(' ／ ')}</span><strong>総和 N = ${matrixTotal} = ${s.N}</strong><p>行列の大きさはセルの個数、Nは全セルの値を足した数。0のセルも行列には含むが、合計には値を加えない。</p></div>`:'';
    $('content').innerHTML=`<div class="split"><div>${table(matrix)}<p class="note">${stage===0?'共起回数は整数。':'PMIの小数は表示時のみ丸める。'} 青枠：${esc(s.words[row])} × ${esc(s.words[col])}</p>${matrixGuide}</div>${cellExplanation()}</div>`;
  } else if(stage===1) {
    const x=s.words[row], rowSum=s.rows[row];
    const probabilityGuide=`<div class="probability-guide"><h3>P(x) は何の確率？</h3><p>記録した <b>N=${s.N}組</b>の「注目語 → 周辺語」ペアから1組を等確率で選ぶ。その組の<b>注目語が x</b>である確率が P(x)。</p><p><b>P(${esc(x)}) = ${rowSum} / ${s.N} = ${fmt(rowSum/s.N)}</b><br>分子の${rowSum}は「${esc(x)}」行の合計、つまり注目語が「${esc(x)}」のペア数。</p><p class="note">文章中で「${esc(x)}」が出る割合ではない。ここでは共起ペアを選んでいる。</p></div>`;
    $('content').innerHTML=`<div class="split"><div><table><thead><tr><th>単語</th><th>行和</th><th>P(x)</th><th>列和</th><th>P(y)</th></tr></thead><tbody>${s.words.map((w,i)=>`<tr><th>${esc(w)}</th><td>${s.rows[i]}</td><td>${fmt(s.rows[i]/s.N)}</td><td>${s.cols[i]}</td><td>${fmt(s.cols[i]/s.N)}</td></tr>`).join('')}</tbody></table><p>N = ΣᵢΣⱼ C[i,j] = <b>${s.N}</b></p><p class="note">左右を同じ幅で数えるため、この行列では行和と列和が一致する。</p>${probabilityGuide}</div>${cellExplanation()}</div>${pairCountWalk()}`;
  } else if(stage===4) {
    const energy=s.S.reduce((a,v)=>a+v*v,0), kept=s.S.slice(0,k).reduce((a,v)=>a+v*v,0);
    const error=Math.sqrt(Math.max(0,energy-kept));
    $('content').innerHTML=`<div class="decomposition"><div class="block"><strong>M</strong>${s.words.length} × ${s.words.length}</div><b>≈</b><div class="block"><strong>Uₖ</strong>${s.words.length} × ${k}</div><b>×</b><div class="block"><strong>Σₖ</strong>${k} × ${k}</div><b>×</b><div class="block"><strong>Vₖᵀ</strong>${k} × ${s.words.length}</div></div><div class="split"><div><h3>各行が単語ベクトル：Uₖ</h3>${table(reduced,false,Array.from({length:k},(_,i)=>`成分${i+1}`))}</div><div><h3>特異値 σ（大きい順）</h3><div class="bars">${s.S.map((v,i)=>`<div class="bar ${i<k?'kept':''}" style="height:${Math.max(1,v/(s.S[0]||1)*100)}%" title="σ${i+1} = ${fmt(v)}"><span>${i+1}</span></div>`).join('')}</div><p>${s.S.map(v=>fmt(v)).join(' / ')}</p><div class="formula"><p>特異値の二乗和の保持率</p><p class="value">${energy?(kept/energy*100).toFixed(1)+'%':'定義なし（PPMIが全て0）'}</p><p>復元誤差 ‖M − UₖΣₖVₖᵀ‖F = ${fmt(error)}</p></div></div></div>`;
  } else if(stage===5) {
    $('content').innerHTML=`<div class="split"><div><canvas class="plot" id="plot" aria-label="Uの第1・第2成分の散布図"></canvas></div><div class="formula"><h3>${esc(s.words[q])} の単語ベクトル</h3><div class="chips">${reduced[q].map(v=>`<span>${fmt(v)}</span>`).join('')}</div><p>横軸：Uの第1成分<br>縦軸：${k>=2?'Uの第2成分':'0（1次元を選択中）'}</p><p>${k>2?`残りの${k-2}成分は図に表示しない。`:'表示する成分と選択次元は一致する。'}</p><p>同じ位置に重なる語もある。基準語メニューでも選択できる。</p></div></div>`;
    requestAnimationFrame(drawPlot);
  } else {
    $('content').innerHTML=`<div class="rank-grid">${[[s.C,'共起行列',s.words.length],[s.M,'PPMI',s.words.length],[reduced,'SVD：Uₖ',k]].map(([m,title,dim])=>{const ranked=s.words.map((w,i)=>({w,i,v:cosine(m[q],m[i])})).filter(x=>x.i!==q).sort((a,b)=>(b.v??-2)-(a.v??-2)||a.i-b.i);return `<section><h3>${title}（${dim}次元）</h3><div class="scroll"><table><thead><tr><th>単語</th><th>コサイン類似度</th></tr></thead><tbody>${ranked.map(x=>`<tr><th>${esc(x.w)}</th><td>${x.v===null?'定義なし':fmt(x.v)}</td></tr>`).join('')}</tbody></table></div></section>`;}).join('')}</div><p class="note">ゼロベクトルとのコサイン類似度は定義なし。同点は単語ID順。次元削減で順位が変わっても、意味の理解が改善したとは限らない。</p>`;
  }
  $('previous').disabled=stage===0; $('next').disabled=stage===6; $('step-count').textContent=`${stage+1} / 7`;
}
function drawPlot() {
  const canvas=$('plot');if(!canvas)return;
  const box=canvas.getBoundingClientRect(), ratio=window.devicePixelRatio||1;
  canvas.width=box.width*ratio;canvas.height=box.height*ratio;
  const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);
  const w=box.width,h=box.height,k=Number($('dimension').value),q=Number($('query').value);
  const pts=state.U.map(r=>[r[0],k>1?r[1]:0]);
  const max=Math.max(.1,...pts.flat().map(Math.abs))*1.25;
  const xy=p=>[45+(p[0]+max)/(2*max)*(w-90),h-40-(p[1]+max)/(2*max)*(h-80)];
  ctx.strokeStyle='#c8d7d5';ctx.beginPath();ctx.moveTo(30,h/2);ctx.lineTo(w-20,h/2);ctx.moveTo(w/2,20);ctx.lineTo(w/2,h-20);ctx.stroke();
  ctx.font='12px sans-serif';ctx.fillStyle='#617171';ctx.fillText('U₁',w-25,h/2-8);ctx.fillText(k>1?'U₂':'0',w/2+8,18);
  const groups=[];
  pts.forEach((p,i)=>{const [x,y]=xy(p);const group=groups.find(g=>Math.hypot(g.x-x,g.y-y)<.5);if(group)group.ids.push(i);else groups.push({x,y,ids:[i]});});
  const labels=[];
  groups.forEach(({x,y,ids})=>{
    ctx.fillStyle=ids.includes(q)?'#ad3856':'#087e79';ctx.beginPath();ctx.arc(x,y,ids.includes(q)?7:5,0,Math.PI*2);ctx.fill();
    const text=ids.map(i=>state.words[i]).join(' / '), tw=Math.min(w-16,ctx.measureText(text).width);
    let lx=Math.max(8,Math.min(w-tw-8,x+10)),ly=Math.max(18,y-12);
    for(let t=0;t<40;t++) {
      ly=Math.max(18,Math.min(h-10,y-12+(t%2?1:-1)*Math.ceil(t/2)*18));
      if(!labels.some(r=>lx<r.x+r.w+5&&lx+tw+5>r.x&&ly-14<r.y+4&&ly+4>r.y-14))break;
    }
    labels.push({x:lx,y:ly,w:tw});ctx.strokeStyle='#a7bbb7';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(lx,ly-4);ctx.stroke();
    ctx.fillStyle='#203033';ctx.fillText(text,lx,ly,w-16);
  });
  canvas.onclick=e=>{const rect=canvas.getBoundingClientRect();let best=-1,distance=24;pts.forEach((p,i)=>{const [x,y]=xy(p),d=Math.hypot(x-(e.clientX-rect.left),y-(e.clientY-rect.top));if(d<distance){best=i;distance=d;}});if(best>=0){$('query').value=String(best);render();}};
}
document.querySelector('.tabs').innerHTML=names.map((name,i)=>`<button role="tab" id="tab-${i}" aria-controls="panel" aria-selected="${i===0}" data-stage="${i}">${i+1}. ${name}</button>`).join('');
document.querySelector('.tabs').onclick=e=>{const b=e.target.closest('[data-stage]');if(b){stage=Number(b.dataset.stage);render();}};
document.querySelector('.tabs').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();stage=e.key==='Home'?0:e.key==='End'?6:(stage+(e.key==='ArrowRight'?1:6))%7;render();$(`tab-${stage}`).focus();};
$('content').onclick=e=>{const b=e.target.closest('[data-cell]');if(b){[row,col]=b.dataset.cell.split(',').map(Number);render();}};
$('content').onchange=e=>{if(e.target.matches('[data-pair-row]'))row=Number(e.target.value);else if(e.target.matches('[data-pair-col]'))col=Number(e.target.value);else return;render();};
$('apply').onclick=apply;$('dimension').onchange=render;$('query').onchange=render;
$('preset').onchange=()=>{if(examples[$('preset').value]){$('text').value=examples[$('preset').value];apply();}};
$('text').oninput=()=>{$('preset').value='custom';$('dirty').hidden=false;};$('window').onchange=()=>{$('dirty').hidden=false;};
$('previous').onclick=()=>{stage=Math.max(0,stage-1);render();};$('next').onclick=()=>{stage=Math.min(6,stage+1);render();};
window.addEventListener('resize',()=>{if(stage===5)drawPlot();});
apply();
