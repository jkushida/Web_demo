"use strict";
const $ = id => document.getElementById(id);
const titles = {vehicles:"自動車と関連語",technology:"コンピュータと技術",places:"国と都市",comparison:"程度と比較",analogy:"類推で使う語",neighbors:"指定語の近傍"};
const presets = {
  vehicles:["car","cars","auto","truck","luxury","toyota","nissan","ford","honda","motor"],
  technology:["computer","computers","software","digital","systems","technology","network","data","machine","electronic"],
  places:["japan","china","india","america","europe","tokyo","london","paris","frankfurt","germany"],
  comparison:["good","bad","better","worse","more","less","greater","lower","high","low"],
  analogy:["take","took","go","went","car","cars","child","children","good","better","bad","worse"],
};
let data = null;
let model = null;
let zoom = 1;
const svgNS = "http://www.w3.org/2000/svg";
const icon = () => window.lucide?.createIcons();
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function setError(message=""){$("error").hidden=!message;$("error").textContent=message;}
function vectorAt(id){return model.vectors.subarray(id*model.dimensions,(id+1)*model.dimensions);}
function similarityToVector(id,vector){const row=vectorAt(id);let sum=0;for(let i=0;i<model.dimensions;i++)sum+=row[i]*vector[i];return sum;}
function requireWord(value){const word=String(value||"").trim().toLowerCase();if(!word||word.length>80)throw new Error("1〜80文字の単語を入力");if(!model.wordToId.has(word))throw new Error(`「${word}」は語彙10,000語に含まれない`);return word;}
function neighbors(word,topn=12,exclude=[]){
  word=requireWord(word);const query=vectorAt(model.wordToId.get(word));const blocked=new Set([word,...exclude]);const rows=[];
  for(let id=0;id<model.words.length;id++){const candidate=model.words[id];if(!blocked.has(candidate))rows.push({word:candidate,similarity:similarityToVector(id,query)});}
  rows.sort((a,b)=>b.similarity-a.similarity);return rows.slice(0,topn);
}

function projectPCA(words){
  const rows=words.map(word=>Array.from(vectorAt(model.wordToId.get(word))));const n=rows.length,d=model.dimensions;
  const mean=Array(d).fill(0);for(const row of rows)for(let j=0;j<d;j++)mean[j]+=row[j]/n;
  const centered=rows.map(row=>row.map((value,j)=>value-mean[j]));
  const gram=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>{let sum=0;for(let k=0;k<d;k++)sum+=centered[i][k]*centered[j][k];return sum;}));
  const eigenvectors=[];const axes=[];
  for(let axis=0;axis<2;axis++){
    let vector=Array.from({length:n},(_,i)=>Math.sin((i+1)*(axis+1)*1.37));
    for(let iteration=0;iteration<60;iteration++){
      let next=gram.map(row=>row.reduce((sum,value,j)=>sum+value*vector[j],0));
      for(const previous of eigenvectors){const projection=next.reduce((sum,value,j)=>sum+value*previous[j],0);next=next.map((value,j)=>value-projection*previous[j]);}
      const norm=Math.sqrt(next.reduce((sum,value)=>sum+value*value,0));if(norm<1e-12){next=Array(n).fill(0);break;}vector=next.map(value=>value/norm);
    }
    eigenvectors.push(vector);const multiplied=gram.map(row=>row.reduce((sum,value,j)=>sum+value*vector[j],0));const lambda=Math.max(0,vector.reduce((sum,value,j)=>sum+value*multiplied[j],0));axes.push(vector.map(value=>value*Math.sqrt(lambda)));
  }
  for(const axis of axes){let pivot=0;for(let i=1;i<n;i++)if(Math.abs(axis[i])>Math.abs(axis[pivot]))pivot=i;if(axis[pivot]<0)for(let i=0;i<n;i++)axis[i]*=-1;}
  const scales=axes.map(axis=>Math.max(1e-8,...axis.map(Math.abs)));return words.map((word,i)=>({word,x:axes[0][i]/scales[0],y:axes[1][i]/scales[1]}));
}

function project(preset,query){
  let words,groups;
  if(preset==="neighbors"){
    query=requireWord(query);words=[query,...neighbors(query,24).map(item=>item.word)];groups=Object.fromEntries(words.map(word=>[word,word===query?"query":"neighbor"]));
  }else if(presets[preset]){
    words=presets[preset].filter(word=>model.wordToId.has(word));groups=Object.fromEntries(words.map(word=>[word,"focus"]));const expanded=[];
    for(const seed of words.slice(0,4))for(const item of neighbors(seed,3,words))if(!expanded.includes(item.word))expanded.push(item.word);
    words.push(...expanded);for(const word of expanded)groups[word]="neighbor";query=words[0];
  }else throw new Error("表示テーマを選択");
  words=[...new Set(words)].slice(0,48);const queryVector=vectorAt(model.wordToId.get(query));const points=projectPCA(words).map(point=>({...point,group:groups[point.word],similarity:similarityToVector(model.wordToId.get(point.word),queryVector)}));
  return {query,preset,points,neighbors:neighbors(query,10)};
}

function analogy(positiveA,negative,positiveB){
  const a=requireWord(positiveA),b=requireWord(negative),c=requireWord(positiveB);const av=vectorAt(model.wordToId.get(a)),bv=vectorAt(model.wordToId.get(b)),cv=vectorAt(model.wordToId.get(c));
  const vector=Array.from({length:model.dimensions},(_,i)=>av[i]-bv[i]+cv[i]);const norm=Math.sqrt(vector.reduce((sum,value)=>sum+value*value,0));for(let i=0;i<vector.length;i++)vector[i]/=Math.max(norm,1e-8);
  const blocked=new Set([a,b,c]);const results=[];for(let id=0;id<model.words.length;id++)if(!blocked.has(model.words[id]))results.push({word:model.words[id],similarity:similarityToVector(id,vector)});results.sort((x,y)=>y.similarity-x.similarity);
  return {positiveA:a,negative:b,positiveB:c,results:results.slice(0,8)};
}

async function loadModel(){
  document.body.classList.add("loading");setError();
  try{
    const [metadata,buffer]=await Promise.all([fetch("pretrained-words.json").then(response=>{if(!response.ok)throw new Error("語彙データを読み込めない");return response.json();}),fetch("pretrained-vectors.f32").then(response=>{if(!response.ok)throw new Error("ベクトルデータを読み込めない");return response.arrayBuffer();})]);
    const vectors=new Float32Array(buffer);if(vectors.length!==metadata.words.length*metadata.dimensions)throw new Error("モデルデータの形状が一致しない");
    model={words:metadata.words,dimensions:metadata.dimensions,vectors,wordToId:new Map(metadata.words.map((word,id)=>[word,id]))};
    $("model-name").textContent="Improved CBOW / PTB";$("model-size").textContent=`${model.words.length.toLocaleString()}語 · ${model.dimensions}次元`;
    await loadProjection();await calculateAnalogy();
  }catch(error){setError(`${error.message}。GitHub PagesまたはローカルHTTPサーバーから開く。`);$("model-name").textContent="モデル未読込";}
  finally{document.body.classList.remove("loading");}
}
async function loadProjection(preset=$("preset").value,query=$("query").value){if(!model)return;document.body.classList.add("loading");setError();try{const result=project(preset,query);data=result;$("query").value=result.query;$("query-word").textContent=result.query;$("selected-word").textContent=result.query;$("plot-title").textContent=titles[preset];renderPlot();renderNeighbors();}catch(error){setError(error.message);}finally{document.body.classList.remove("loading");}}
function add(tag,attrs={},parent){const node=document.createElementNS(svgNS,tag);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,value);if(parent)parent.appendChild(node);return node;}
function renderPlot(){
  const grid=$("grid"),links=$("links"),points=$("points");grid.replaceChildren();links.replaceChildren();points.replaceChildren();
  for(let value=-400;value<=400;value+=100){add("line",{x1:value,y1:-330,x2:value,y2:330,class:value===0?"axis-line":"grid-line"},grid);add("line",{x1:-500,y1:value,x2:500,y2:value,class:value===0?"axis-line":"grid-line"},grid);}
  const query=data.points.find(point=>point.word===data.query);const position=point=>({x:point.x*420*zoom,y:-point.y*270*zoom});const qp=position(query);
  for(const point of data.points){if(point.word===data.query)continue;const p=position(point);add("line",{x1:qp.x,y1:qp.y,x2:p.x,y2:p.y,class:"link",style:`opacity:${Math.max(0.08,point.similarity*.55)}`},links);}
  const showNeighborLabels=$("show-neighbor-labels").checked;
  for(const point of data.points){const p=position(point);const group=add("g",{class:`point ${point.group} ${point.word===data.query?"query":""}`,tabindex:"0",role:"button","aria-label":`${point.word}、${data.query}との類似度${point.similarity.toFixed(3)}`,transform:`translate(${p.x} ${p.y})`},points);add("circle",{r:point.word===data.query?10:point.group==="focus"?8:6},group);if(point.group!=="neighbor"||showNeighborLabels)add("text",{x:point.word===data.query?14:10,y:-9},group).textContent=point.word;group.addEventListener("click",()=>chooseWord(point.word));group.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();chooseWord(point.word);}});group.addEventListener("pointerenter",event=>showTooltip(event,point));group.addEventListener("pointerleave",()=>$("tooltip").hidden=true);}
}
function showTooltip(event,point){const box=$("plot-shell").getBoundingClientRect();const tip=$("tooltip");tip.innerHTML=`<b>${escapeHTML(point.word)}</b><br>${data.query}との類似度 ${point.similarity.toFixed(4)}`;tip.style.left=`${Math.min(box.width-150,event.clientX-box.left+12)}px`;tip.style.top=`${Math.max(6,event.clientY-box.top-45)}px`;tip.hidden=false;}
function renderNeighbors(){$("neighbor-list").innerHTML=data.neighbors.map((item,index)=>`<button class="neighbor-row" data-word="${escapeHTML(item.word)}"><span class="rank">${String(index+1).padStart(2,"0")}</span><span class="word">${escapeHTML(item.word)}</span><span class="score">${item.similarity.toFixed(3)}</span><span class="similarity-bar"><b style="width:${Math.max(0,item.similarity)*100}%"></b></span></button>`).join("");}
function chooseWord(word){$("preset").value="neighbors";$("query").value=word;loadProjection("neighbors",word);}
async function calculateAnalogy(){if(!model)return;try{const result=analogy($("positive-a").value,$("negative").value,$("positive-b").value);$("analogy-result").innerHTML=result.results.map((item,index)=>`<button data-word="${escapeHTML(item.word)}"><b>${index+1}. ${escapeHTML(item.word)}</b><span>${item.similarity.toFixed(4)}</span></button>`).join("");}catch(error){setError(error.message);}}
$("preset").addEventListener("change",()=>{const preset=$("preset").value;const defaults={vehicles:"car",technology:"computer",places:"japan",comparison:"good",analogy:"take"};if(defaults[preset])$("query").value=defaults[preset];loadProjection();});
$("query-form").addEventListener("submit",event=>{event.preventDefault();$("preset").value="neighbors";loadProjection("neighbors",$("query").value);});
$("neighbor-list").addEventListener("click",event=>{const row=event.target.closest("[data-word]");if(row)chooseWord(row.dataset.word);});
$("zoom").addEventListener("input",()=>{zoom=Number($("zoom").value)/100;$("zoom-value").textContent=`${$("zoom").value}%`;renderPlot();});
$("show-neighbor-labels").addEventListener("change",renderPlot);
$("reset-view").addEventListener("click",()=>{$("zoom").value="100";zoom=1;$("zoom-value").textContent="100%";renderPlot();});
$("analogy-form").addEventListener("submit",event=>{event.preventDefault();calculateAnalogy();});
$("analogy-result").addEventListener("click",event=>{const result=event.target.closest("[data-word]");if(result)chooseWord(result.dataset.word);});
document.querySelector(".preset-analogies").addEventListener("click",event=>{const button=event.target.closest("[data-analogy]");if(!button)return;const[a,b,c]=button.dataset.analogy.split(",");$("positive-a").value=a;$("negative").value=b;$("positive-b").value=c;calculateAnalogy();});
window.addEventListener("resize",()=>data&&renderPlot());
icon();loadModel();
