// Pure view templates retained from the supplied Profit Pilot HTML.
import { categories, sourceOf, flagsOf, categoryOf, publicPicks, extraRows, groupGems, categoryTickets, orderTickets, splitBreakdown } from "./pickboard";
export function renderOriginal(view,data,selectedSport,id,filters={}) {
const TEAMS={NBA:{ATL:"Hawks",BOS:"Celtics",BKN:"Nets",CHA:"Hornets",CHI:"Bulls",CLE:"Cavaliers",DAL:"Mavericks",DEN:"Nuggets",DET:"Pistons",GSW:"Warriors",HOU:"Rockets",IND:"Pacers",LAC:"Clippers",LAL:"Lakers",MEM:"Grizzlies",MIA:"Heat",MIL:"Bucks",MIN:"Timberwolves",NOP:"Pelicans",NYK:"Knicks",OKC:"Thunder",ORL:"Magic",PHI:"76ers",PHX:"Suns",POR:"Trail Blazers",SAC:"Kings",SAS:"Spurs",TOR:"Raptors",UTA:"Jazz",WAS:"Wizards"},
NFL:{ARI:"Cardinals",ATL:"Falcons",BAL:"Ravens",BUF:"Bills",CAR:"Panthers",CHI:"Bears",CIN:"Bengals",CLE:"Browns",DAL:"Cowboys",DEN:"Broncos",DET:"Lions",GB:"Packers",HOU:"Texans",IND:"Colts",JAX:"Jaguars",KC:"Chiefs",LV:"Raiders",LAC:"Chargers",LAR:"Rams",LA:"Rams",MIA:"Dolphins",MIN:"Vikings",NE:"Patriots",NO:"Saints",NYG:"Giants",NYJ:"Jets",PHI:"Eagles",PIT:"Steelers",SF:"49ers",SEA:"Seahawks",TB:"Buccaneers",TEN:"Titans",WAS:"Commanders"}};
const MK={PTS:"Points",REB:"Rebounds",AST:"Assists","3PT":"Threes","3PM":"Threes",PRA:"Pts+Reb+Ast",PR:"Pts+Reb",PA:"Pts+Ast",RA:"Reb+Ast",STL:"Steals",BLK:"Blocks",DD:"Double-double","First Basket":"First basket",
 "Rec yds":"Receiving yards","Rush yds":"Rushing yards","Pass yds":"Passing yards",Rec:"Receptions","Rush+Rec yds":"Scrimmage yards",ATTD:"Anytime TD","First TD":"First TD","2+ TD":"2+ TDs","Either TD":"Either player TD","Rush att":"Rush attempts",Completions:"Completions","Pass att":"Pass attempts","Pass TD":"Passing TDs"};
const S={sport:selectedSport,view,id,data:{...data,nba:data.record.filter(r=>r.Sport==="NBA"),nfl:data.record.filter(r=>r.Sport==="NFL")},live:true,rf:"picks",rmk:"All",shown:40,ef:"pos",emk:"All",q:"",gf:"all",oc:"",os:"All",...filters};

const num=v=>{const n=parseFloat(String(v??"").replace(/[%,+]/g,"").replace("−","-"));return isNaN(n)?null:n};
const pct=v=>{const n=num(v);return n==null?null:(n>1?n/100:n)};
const odds=v=>{const n=num(v);return n==null?"—":(n>0?"+":"−")+Math.abs(Math.round(n))};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const mk=m=>MK[m]||m;
const gid=(d,g)=>"g-"+String(d).replace(/-/g,"")+"-"+String(g).replace("@","-");
const fmtDay=d=>{const x=new Date(d+"T12:00:00");return isNaN(x)?d:x.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})};
const tname=(ab)=>TEAMS[S.sport][ab]||ab;
const sideShort=s=>s==="Over"?"O":s==="Under"?"U":s;
const slug=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const wid=r=>"w-"+String(r.Date).replace(/-/g,"")+"-"+slug(r.Player)+"-"+slug(r.Market)+"-"+slug(r.Side);
const findW=r=>(S.data.writeups||[]).find(w=>w.Date===r.Date&&w.Player===r.Player&&w.Market===r.Market&&w.Side===r.Side);
const pmRes=t=>{const m=String(t||"").match(/^\s*(WIN|LOSS|PUSH)/i);return m?m[1].toUpperCase():null};

function stamp(){return `<span class="stamp">${S.live?'<b>● Live</b> · updates after every board and every grading run':'Loading'}</span>`}
function bars(r){const us=pct(r["Our %"]),bk=pct(r["Book %"]);if(us==null)return"";
 return `<div class="vs"><div class="vsr"><span>Model</span><div class="trk"><div class="fl us" style="width:${(us*100).toFixed(1)}%"></div></div><span>${(us*100).toFixed(0)}%</span></div>${bk!=null?`<div class="vsr"><span>Book</span><div class="trk"><div class="fl bk" style="width:${(bk*100).toFixed(1)}%"></div></div><span>${(bk*100).toFixed(0)}%</span></div>`:""}</div>`}
function sharpOf(r){const v=String(r.Sharp||"").toLowerCase();return /back|confirm|✅/.test(v)?"B":/against|conflict|⛔/.test(v)?"A":/neutral|no ?read|➖/.test(v)?"N":""}
function sharpTag(r){const k=sharpOf(r);return k==="B"?'<span class="tag sharp" title="The sharpest markets agree with the model on this one">Sharp-backed ✓</span>':k==="A"?'<span class="tag neg" title="Sharp money is on the other side">Sharps disagree</span>':k==="N"?'<span class="tag" title="Not enough sharp money on this prop to read">Sharp: no read</span>':""}
function edgeTag(r){const e=num(r["Edge %"]);if(e==null)return"";return `<span class="tag ${e>0?"pos":"neg"}">Edge ${e>0?"+":""}${e.toFixed(1)}%</span>`}
function typeTag(r){return r.Type==="Gem"?'<span class="tag gold">💎 Gem</span>':r.Type==="Straight"?'<span class="tag pick">Model pick</span>':r.Type==="Fade"?'<span class="tag neg">Fade</span>':r.Type==="Pass"?'<span class="tag">Pass</span>':r.Type==="Lean"?'<span class="tag">Lean</span>':r.Type==="Pulled"?'<span class="tag neg">Pulled · late news</span>':""}
function sourceTag(r){return `<span class="tag source">${esc(sourceOf(r))}</span>`}

/* ---------- data helpers ---------- */
function day(){const rows=S.data.board.filter(r=>r.Sport===S.sport);
 const dates=[...rows,...S.data.games.filter(g=>g.Sport===S.sport),...S.data.tickets.filter(t=>t.Sport===S.sport)].map(r=>r.Date).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d));if(!dates.length)return null;
 const last=dates.sort().pop();
 const games=S.data.games.filter(g=>g.Sport===S.sport&&g.Date===last);
 const names=[...new Set([...games.map(g=>g.Game),...rows.filter(r=>r.Date===last).map(r=>r.Game)])];
 const gl=names.map(n=>{const g=games.find(x=>x.Game===n)||{Game:n,Date:last};return {...g,Date:last,rows:rows.filter(r=>r.Date===last&&r.Game===n)}});
 gl.sort((a,b)=>tipMin(a["Tip ET"]||a.rows[0]?.["Tip ET"])-tipMin(b["Tip ET"]||b.rows[0]?.["Tip ET"]));
 return {date:last,rows:rows.filter(r=>r.Date===last),games:gl,tickets:S.data.tickets.filter(t=>t.Sport===S.sport&&t.Date===last)}}
function tipMin(t){const m=String(t||"").match(/(\d+):(\d+)\s*(AM|PM)/i);if(!m)return 9999;let h=+m[1]%12;if(m[3].toUpperCase()==="PM")h+=12;return h*60+ +m[2]}
function implied(g){const sp=num(g.Spread),tot=num(g.Total);if(sp==null||tot==null)return null;const [a,h]=g.Game.split("@");const fav=g.Favorite;
 const fv=tot/2+sp/2,dg=tot/2-sp/2;return {[a]:fav===a?fv:dg,[h]:fav===h?fv:dg}}
function recRows(){const src=S.sport==="NFL"?S.data.nfl:S.data.nba;
 return src.map(r=>{const price=num(r.Price),p=pct(r["Final %"])??pct(r["Model %"]);let ev=null;
  if(price!=null&&p!=null){const dec=price>0?1+price/100:1+100/-price;ev=(p*(dec-1)-(1-p))*100}
  return {...r,price,p,ev,u:num(r.Units)??0,role:(r.Role||"").replace(" SKIP","")}}).filter(r=>["WIN","LOSS","PUSH"].includes(r.Result))}
function agg(rs){const w=rs.filter(r=>r.Result==="WIN").length,l=rs.filter(r=>r.Result==="LOSS").length,p=rs.filter(r=>r.Result==="PUSH").length,u=rs.reduce((a,r)=>a+r.u,0);return {w,l,p,u,n:w+l,hit:w+l?w/(w+l):null}}
const rec=a=>`${a.w}-${a.l}${a.p?"-"+a.p:""}`;
const units=u=>`${u>=0?"+":"−"}${Math.abs(u).toFixed(1)}u`;

/* ---------- views ---------- */
function vBoard(){const d=day();const season=agg(recRows().filter(r=>r.role==="STRAIGHT"));
 if(!d)return `<section class="intro"><span class="lab">${S.sport} model</span><h1>Next ${S.sport} board is on the way</h1>
  <p class="lede">${S.sport==="NFL"?"The NFL board posts Sunday before the early games, plus Thursday and Monday night before kickoff.":"The NBA board posts every game day around 1 PM ET, with an injury check before the evening tips."} Every pick is graded against the box score the next morning.</p>${stamp()}</section>
  <section class="chips4"><button class="sum lead" data-go="record"><span class="lab">Model picks · season</span><span class="v">${rec(season)}</span><span class="s">${season.n?units(season.u)+" · "+(season.hit*100).toFixed(1)+"%":"Grading starts after the first board"}</span></button></section>`;
 const picks=publicPicks(d.rows);const more=extraRows(d.rows);const best=[...d.rows].filter(r=>r.Type!=="Fade"&&r.Type!=="Pass"&&r.Type!=="Pulled"&&num(r["Edge %"])!=null).sort((a,b)=>num(b["Edge %"])-num(a["Edge %"]))[0];
 return `<section class="intro"><span class="lab">${S.sport} model · ${esc(fmtDay(d.date))}</span><h1>The model's number vs the book's</h1>
 <p class="lede">The model prices every prop itself, then compares it with the sportsbook's price after removing the book's cut. Its picks also have to pass a sharp check against the sharpest markets. Tap a game to open the prop analyzer. Every pick gets graded tomorrow, wins and losses.</p>${stamp()}</section>
 <section class="chips4">
  <button class="sum lead" data-go="record"><span class="lab">Model picks · season</span><span class="v">${rec(season)}</span><span class="s">${season.n?units(season.u)+" · "+(season.hit*100).toFixed(1)+"% hit":"Grading starts tomorrow morning"}</span></button>
  <button class="sum" data-jump="${picks.length?"picks":d.rows.some(r=>r.Type==="Gem")?"outliers":"games"}"><span class="lab">Today's picks</span><span class="v">${picks.length}</span><span class="s">${picks.filter(r=>sharpOf(r)==="B").length?picks.filter(r=>sharpOf(r)==="B").length+" sharp-backed · ":""}across ${d.games.length} game${d.games.length===1?"":"s"}</span></button>
  ${best?`<button class="sum" data-go="${gid(d.date,best.Game)}"><span class="lab">Biggest edge</span><span class="v">+${num(best["Edge %"]).toFixed(1)}%</span><span class="s">${esc(best.Player)} ${sideShort(best.Side)}${esc(best.Line)} ${esc(mk(best.Market))}</span></button>`:""}
  <button class="sum" data-go="edges"><span class="lab">Props priced</span><span class="v">${d.rows.length}</span><span class="s">sorted by edge on the Edges page</span></button>
 </section>
 ${outliers(d)}
 ${picks.length?`<section id="picks" class="section-stack"><div class="day"><h2>Today's picks</h2><span>${picks.length} straight${picks.length===1?"":"s"}</span></div><div class="picks">${picks.map((r,i)=>pickCard(r,i)).join("")}</div></section>`:""}
 ${d.games.length?`<section id="games" class="section-stack"><div class="day"><h2>${esc(fmtDay(d.date))}</h2><span>${d.games.length} games</span></div><div class="games">${d.games.map(g=>gameCard(g,d.date)).join("")}</div></section>`:""}
 ${more.length?`<details class="more-board"><summary>More from the board <span>${more.length} leans / passes</span></summary><div class="section-stack">${more.map(row).join("")}</div></details>`:""}
 ${d.tickets.length?`<section class="section-stack"><div class="day"><h2>Tickets</h2><span>lottos are lottos · small stakes</span></div><div class="tix">${orderTickets(d.tickets).map(ticket).join("")}</div></section>`:""}`}

function outliers(d){const available=categories.filter(c=>d.rows.some(r=>r.Type==="Gem"&&categoryOf(r)===c.key));if(!available.length)return "";
 const selected=available.find(c=>c.key===S.oc)||available[0];const gems=groupGems(d.rows,selected.key,S.os);const parlays=categoryTickets(d.tickets,selected.key,S.os);
 return `<section id="outliers" class="section-stack"><div class="day"><h2>💎 Outliers</h2><span>${d.rows.filter(r=>r.Type==="Gem").length} model spots</span></div>
 <div class="category-tabs" role="group" aria-label="Outlier category">${available.map(c=>`<button class="f" data-oc="${c.key}" aria-pressed="${selected.key===c.key}">${c.label}</button>`).join("")}</div>
 <div class="filters" role="group" aria-label="Outlier model">${["All","Model A","Model B"].map(s=>`<button class="f" data-os="${s}" aria-pressed="${S.os===s}">${s}</button>`).join("")}</div>
 <div class="outlier-grid">${gems.map(gemCard).join("")||'<p class="note">No outliers from this model in this category.</p>'}</div>
 ${parlays.length?`<h3>${selected.label} parlays</h3><div class="tix">${parlays.map(ticket).join("")}</div>`:""}</section>`}
function gemCard(gem){const r=gem.row;const market=mk(r.Market).toLowerCase();const bet=[r.Side,r.Line,market].filter(Boolean).join(" ");
 return `<article class="pcard gem-card"><div class="gtime"><span class="pmeta">${esc(r.Game.replace("@"," @ "))}</span><span class="tag source">${esc(gem.source)}</span></div><h3>${esc(r.Player)}</h3><div class="gem-bet">${esc(bet)}</div>
 ${gem.entries.map(entry=>`<div class="gem-model"><span class="lab">${esc(sourceOf(entry))}</span><div class="pmeta">${odds(entry.Price)} at ${esc(entry.Book)}${pct(entry["Our %"])!=null?` · model ${(pct(entry["Our %"])*100).toFixed(1)}%`:""}</div><div class="tags">${flagsOf(entry).slice(1).map(f=>`<span class="tag">${esc(f)}</span>`).join("")}</div>${entry.Thesis?`<p class="note thesis">${esc(entry.Thesis)}</p>`:""}</div>`).join("")}
 <div class="btnrow"><button class="cta" data-go="${gid(r.Date,r.Game)}">Open the game →</button></div></article>`}
function breakdown(g){if(!g.Breakdown&&!g["Model B Thesis"])return "";const parts=splitBreakdown(g.Breakdown||"");
 return `<details class="game-breakdown"><summary>Breakdown <span class="chev">›</span></summary><div class="breakdown-body">${g.Breakdown?`<span class="lab">Model A</span>${parts.body?`<p class="thesis">${esc(parts.body)}</p>`:""}${parts.narrative.length?`<div class="narrative-strip">${parts.narrative.map(p=>{const match=p.match(/^(NARRATIVE|PRICED IN|OPPOSITE SCRIPT|VERDICT)\s*:?\s*(.*)$/i);return `<div><span class="lab">${esc(match?match[1]:"Narrative")}</span><span>${esc(match?match[2]:p)}</span></div>`}).join("")}</div>`:""}`:""}${g["Model B Thesis"]?`<h3>Second opinion</h3><span class="lab">Model B</span><p class="thesis">${esc(g["Model B Thesis"])}</p>`:""}</div></details>`}
function pickCard(r,i){return `<article class="pcard"><div class="gtime"><span class="pnum">${String(i+1).padStart(2,"0")} · ${esc(r.Game.replace("@"," @ "))}</span><span class="pmeta">${esc(r["Tip ET"])} ET</span></div>
 <div class="pwho">${esc(r.Player)}</div><div class="pbet">${esc(r.Side.toUpperCase())} ${esc(r.Line)} <small>${esc(mk(r.Market).toLowerCase())}</small></div>
 <div class="pmeta">${odds(r.Price)} at ${esc(r.Book)}${r.Projection?` · model projection ${esc(r.Projection)}`:""}</div>${bars(r)}
 <div class="tags">${sharpTag(r)}${edgeTag(r)}${r.Confidence?`<span class="tag">${esc(r.Confidence)} conf</span>`:""}</div>${r.Note?`<p class="note">${esc(r.Note)}</p>`:""}
 <div class="btnrow">${findW(r)?`<button class="cta solid" data-go="${wid(r)}">Read the breakdown →</button>`:""}<button class="cta" data-go="${gid(r.Date,r.Game)}">Open the game →</button></div></article>`}
function gameCard(g,date){const [a,h]=g.Game.split("@");const im=implied(g);const rows=g.rows;const picks=rows.filter(r=>r.Type==="Straight");
 const pos=rows.filter(r=>num(r["Edge %"])>0&&r.Type!=="Pulled");const best=[...pos].sort((x,y)=>num(y["Edge %"])-num(x["Edge %"]))[0];
 const fb=rows.some(r=>/First/.test(r.Market));
 return `<article class="gcard"><div class="gtime"><span class="lab">${esc(g["Tip ET"]||rows[0]?.["Tip ET"]||"")} ET</span><span class="lab">${rows.length} props</span></div>
 <div class="teams">${im?'<div class="trow"><span></span><span></span><span class="lab">Implied pts</span></div>':""}${[a,h].map(t=>`<div class="trow"><span class="abbr">${esc(t)}</span><span class="tname">${esc(tname(t))}</span><span class="imp">${im?im[t].toFixed(1):""}</span></div>`).join("")}</div>
 <dl class="kv">${g.Spread?`<dt>Vegas line</dt><dd>${esc(g.Favorite)} −${esc(g.Spread)} · total ${esc(g.Total)}</dd>`:""}
 <dt>Model picks</dt><dd>${picks.length?picks.map(p=>`${esc(p.Player.split(" ").slice(-1)[0])} ${sideShort(p.Side)}${esc(p.Line)} ${esc(p.Market)}`).join(", "):"none in this game"}</dd>
 ${best?`<dt>Best edge</dt><dd>${esc(best.Player)} ${sideShort(best.Side)}${esc(best.Line)} ${esc(best.Market)} · <span class="posc">+${num(best["Edge %"]).toFixed(1)}%</span></dd>`:""}</dl>
 ${g.Note?`<p class="note">${esc(g.Note)}</p>`:""}${breakdown(g)}
 <div class="btnrow"><button class="cta solid" data-go="${gid(date,g.Game)}">Prop analyzer →</button>${fb?`<button class="cta" data-go="${gid(date,g.Game)}" data-mf="First">${S.sport==="NFL"?"First TD":"First basket"} →</button>`:`<span class="cta locked">${S.sport==="NFL"?"First TD":"First basket"} · not priced</span>`}</div></article>`}
function ticket(t){return `<div class="tk"><div class="top"><span class="tag gold">${esc(t.Tier)}${t["Leg count"]?` · ${esc(t["Leg count"])} legs`:""}</span><span class="odds">${odds(t["Est. odds"])}</span></div>${sourceTag(t)}
 <h3>${esc(t.Ticket)}</h3><ol>${String(t.Legs).split("|").map(l=>`<li>${esc(l.trim())}</li>`).join("")}</ol>
 <p class="note">Hits about ${((pct(t["Our %"])||0)*100).toFixed(1)}% of the time. What kills it: ${esc(t["What kills it"])}</p></div>`}

function vGame(){const d=day();const g=d&&d.games.find(x=>gid(d.date,x.Game)===S.id);
 if(!g)return `<section class="empty"><span>That game isn't on today's board anymore.</span><button class="cta" data-go="board">← Back to the board</button></section>`;
 const [a,h]=g.Game.split("@");const im=implied(g);let rows=g.rows;
 const players=new Set(rows.map(r=>r.Player)).size;const picks=rows.filter(r=>r.Type==="Straight");
 if(S.gf==="picks")rows=rows.filter(r=>r.Type==="Straight");if(S.gf==="pos")rows=rows.filter(r=>num(r["Edge %"])>0&&r.Type!=="Pulled");
 const groups={};rows.forEach(r=>{(groups[r.Market]=groups[r.Market]||[]).push(r)});
 Object.values(groups).forEach(l=>l.sort((x,y)=>num(y["Edge %"])-num(x["Edge %"])));
 const order=Object.keys(groups).sort((x,y)=>groups[y].length-groups[x].length);
 return `<section class="intro"><button class="back" data-go="board">← Back to the board</button>
 <span class="lab">${esc(fmtDay(d.date))} · ${esc(g["Tip ET"]||g.rows[0]?.["Tip ET"]||"")} ET</span>
 <h1>${esc(tname(a))} at ${esc(tname(h))}</h1>
 <span class="lab">Player props · ${players} players · ${g.rows.length} markets priced</span></section>
 <section class="chips4">
  ${g.Spread?`<div class="sum"><span class="lab">Vegas line</span><span class="v">${esc(g.Favorite)} −${esc(g.Spread)}</span><span class="s">total ${esc(g.Total)}</span></div>`:""}
  ${im?`<div class="sum"><span class="lab">Implied team totals</span><span class="v">${a} ${im[a].toFixed(1)} · ${h} ${im[h].toFixed(1)}</span><span class="s">from the spread and total</span></div>`:""}
  <div class="sum"><span class="lab">Model picks here</span><span class="v">${picks.length}</span><span class="s">${picks.length?picks.map(p=>esc(p.Player.split(" ").slice(-1)[0])).join(", "):"Game breakdown below"}</span></div>
 </section>
 ${g.Note?`<p class="lede">${esc(g.Note)}</p>`:""}${breakdown(g)}
 <section style="display:grid;gap:14px"><div class="filters">
  <button class="f" data-gf="all" aria-pressed="${S.gf==="all"}">Every prop</button><button class="f" data-gf="pos" aria-pressed="${S.gf==="pos"}">Positive edge</button><button class="f" data-gf="picks" aria-pressed="${S.gf==="picks"}">Model picks</button></div>
 ${order.length?order.map(m=>`<div class="mkt" id="m-${esc(m.replace(/[^A-Za-z0-9]/g,""))}"><h3>${esc(mk(m))}<span>${groups[m].length}</span></h3>${groups[m].map(row).join("")}</div>`).join(""):'<div class="empty">Nothing matches that filter in this game.</div>'}
 </section>
 <p class="note">Tap a prop to see the projection against the line and how often the model thinks it clears. The book's cut is already removed from its number, so the two bars compare like for like.</p>`}
function row(r){const us=pct(r["Our %"]);const n=us!=null?Math.round(us*50):null;
 const proj=num(r.Projection),line=num(r.Line);
 let nl="";if(proj!=null&&line!=null&&!/TD|First/.test(r.Market)){const lo=Math.min(proj,line)*0.6,hi=Math.max(proj,line)*1.35;const x=v=>((v-lo)/(hi-lo)*100).toFixed(1);
  nl=`<div><span class="lab">Projection vs line</span><div class="nline"><div class="axis"></div><div class="mk" style="left:${x(line)}%"><i></i><b>line ${line}</b></div><div class="mk us" style="left:${x(proj)}%"><b>model ${proj}</b><i></i></div></div></div>`}
 const sim=n!=null?`<div class="sim"><span class="lab">50 simulated games</span><div class="ticks" aria-hidden="true">${Array.from({length:50},(_,i)=>`<i class="${i<n?"h":""}"></i>`).join("")}</div><span class="simcap">About ${n} of 50 nights the ${r.Side==="Under"?"under":r.Side==="Over"?"over":"bet"} cashes · break-even at ${odds(r.Price)} is ${Math.round(be(num(r.Price))*50)} of 50</span></div>`:"";
 return `<details class="row"><summary><span class="rname">${esc(r.Player)}<small>${esc(r.Side)} ${esc(r.Line)} · ${esc(r.Team)}</small></span>
 <span class="rprice">${odds(r.Price)}<small>${esc(r.Book)}</small></span><span class="tags">${typeTag(r)}${sharpOf(r)==="B"?'<span class="tag sharp">Sharp ✓</span>':""}${edgeTag(r)}<span class="chev">›</span></span></summary>
 <div class="rbody">${nl}${bars(r)}${sim}${r.Thesis?`<p class="note thesis">${esc(r.Thesis)}</p>`:""}${r.Note?`<p class="note">${esc(r.Note)}</p>`:""}${findW(r)?`<button class="rlink" data-go="${wid(r)}">Read the full breakdown →</button>`:""}<div class="tags">${sourceTag(r)}${sharpTag(r)}${r.Confidence?`<span class="tag">${esc(r.Confidence)} confidence</span>`:""}${r.Tier?`<span class="tag">Tier ${esc(r.Tier)}</span>`:""}</div></div></details>`}
const be=o=>o==null?0.5:(o>0?100/(o+100):-o/(-o+100));

function vEdges(){const d=day();if(!d)return vBoard();
 let rows=d.rows.filter(r=>r.Type!=="Pulled");const mks=["All",...new Set(rows.map(r=>r.Market))];
 if(S.ef==="pos")rows=rows.filter(r=>num(r["Edge %"])>0);if(S.ef==="sharp")rows=rows.filter(r=>sharpOf(r)==="B");if(S.ef==="under")rows=rows.filter(r=>r.Side==="Under");if(S.ef==="over")rows=rows.filter(r=>r.Side==="Over");
 if(S.emk!=="All")rows=rows.filter(r=>r.Market===S.emk);if(S.q)rows=rows.filter(r=>(r.Player+" "+r.Team+" "+r.Game).toLowerCase().includes(S.q.toLowerCase()));
 rows.sort((a,b)=>num(b["Edge %"])-num(a["Edge %"]));
 return `<section class="intro"><span class="lab">${S.sport} · ${esc(fmtDay(d.date))}</span><h1>Where the model disagrees with the book</h1>
 <p class="lede">Every prop the model priced today, biggest edge first. A big gap is a question worth asking. When the model disagrees with the market by a lot, it's usually the model that's missing something, so those numbers get pulled back toward the market before ranking.</p>${stamp()}</section>
 <section style="display:grid;gap:12px"><div class="filters">
  ${[["pos","Positive edge"],["sharp","Sharp-backed"],["all","Everything"],["under","Unders"],["over","Overs"]].map(([k,l])=>`<button class="f" data-ef="${k}" aria-pressed="${S.ef===k}">${l}</button>`).join("")}
  <input class="search" id="q" type="search" placeholder="Search a player or team" value="${esc(S.q)}" aria-label="Search a player or team"></div>
 <div class="filters">${mks.map(m=>`<button class="f" data-emk="${esc(m)}" aria-pressed="${S.emk===m}">${esc(m==="All"?"All markets":mk(m))}</button>`).join("")}</div>
 <div style="display:grid;gap:8px">${rows.map(r=>row(r).replace('<span class="rname">',`<span class="rname"><span class="lab" style="display:block">${esc(r.Game.replace("@"," @ "))} · ${esc(mk(r.Market))}</span>`)).join("")||'<div class="empty">Nothing matches. Try another filter.</div>'}</div></section>`}

function vRecord(){const rs=recRows();const st=rs.filter(r=>r.role==="STRAIGHT");
 const raw=S.sport==="NFL"?S.data.nfl:S.data.nba;const sharpNote=rs.length===0&&raw.length>0&&Object.values(raw[0]).some(v=>/^No sharp-backed/.test(String(v).trim()));
 const sets={picks:["Model picks",st],e3:["Picks · 3%+ edge",st.filter(r=>r.ev!=null&&r.ev>=3)]};
 let list=sets[S.rf][1];const mks=["All",...new Set(list.map(r=>r.Market))].sort((a,b)=>a==="All"?-1:b==="All"?1:a<b?-1:1);
 if(S.rmk!=="All")list=list.filter(r=>r.Market===S.rmk);list=[...list].sort((a,b)=>a.Date<b.Date?1:-1);
 return `<section class="intro"><span class="lab">${S.sport} record</span><h1>Every pick. Graded. Nothing deleted.</h1>
 <p class="lede">Only picks that clear the full model AND the sharp-money check count here. The record starts Oct 22, 2026. Every pick is graded against the price posted before the game, using the official box score. Losses stay on the record.</p>${stamp()}</section>
 <section style="display:grid;gap:10px"><span class="lab">Tap a tile to filter the list</span><div class="tiles">${Object.entries(sets).map(([k,[l,r]])=>{const a=agg(r);return `<button class="tile" data-rf="${k}" aria-pressed="${S.rf===k}"><span class="lab">${l}</span><span class="big">${rec(a)}</span><span class="s">${a.n?`${(a.hit*100).toFixed(1)}% · <span class="${a.u>=0?"posc":"negc"}">${units(a.u)}</span>`:"no graded picks yet"}</span></button>`}).join("")}</div></section>
 ${rs.length?`<section>${chart(st)}</section>
 <section style="display:grid;gap:10px"><div class="day"><h2>Showing ${sets[S.rf][0].toLowerCase()}</h2><span>${list.length} graded</span></div>
 <div class="filters">${mks.map(m=>`<button class="f" data-rmk="${esc(m)}" aria-pressed="${S.rmk===m}">${esc(m==="All"?"All markets":mk(m))}</button>`).join("")}</div>
 <div class="tw"><table><thead><tr><th>Date</th><th>Player</th><th>Bet</th><th>Price</th><th>Model %</th><th>Actual</th><th>Result</th><th>Units</th></tr></thead><tbody>
 ${list.slice(0,S.shown).map(r=>`<tr><td>${esc(r.Date)}</td><td>${esc(r.Player)}<br><span class="lab">${esc(r.Game)}</span></td><td>${esc(r.Side)} ${esc(r.Line)} ${esc(mk(r.Market))}</td><td class="n">${odds(r.price)}</td><td class="n">${r.p!=null?(r.p*100).toFixed(0)+"%":"—"}</td><td class="n">${esc(r.Actual)}</td><td><span class="res ${r.Result[0]}">${r.Result}</span></td><td class="n ${r.u>=0?"posc":"negc"}">${r.u>=0?"+":""}${r.u.toFixed(2)}</td></tr>`).join("")}
 </tbody></table></div>${list.length>S.shown?`<button class="cta" id="more" style="justify-self:center">Show ${Math.min(60,list.length-S.shown)} more</button>`:""}</section>`
 :`<section class="empty"><span>${sharpNote?"The sharp-backed record starts with tonight's picks. Check back tomorrow morning.":`${S.sport} grading starts after the first board. Check back tomorrow morning.`}</span>${S.sport==="NBA"?'<button class="cta" data-sp="NFL">See the NFL record →</button>':""}</section>`}`}
function chart(st){st=[...st].sort((a,b)=>a.Date<b.Date?-1:1);if(st.length<3)return"";let c=0;const pts=st.map(r=>c+=r.u);
 const W=800,H=190,L=40,R=12,T=14,B=26,mn=Math.min(0,...pts),mx=Math.max(0,...pts);
 const x=i=>L+(i/(pts.length-1))*(W-L-R),y=v=>T+(mx-v)/((mx-mn)||1)*(H-T-B);
 const d=pts.map((v,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");const ticks=[...new Set([mn,0,mx].map(v=>+v.toFixed(1)))];
 return `<div class="chart"><span class="lab">Units on the model's picks, one pick at a time</span><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Running units on the model's picks">
 ${ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--rule)"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end" font-size="11" font-family="IBM Plex Mono,monospace" fill="var(--soft)">${v>0?"+":""}${v.toFixed(1)}</text>`).join("")}
 <path d="${d} L${x(pts.length-1)},${y(0)} L${x(0)},${y(0)} Z" fill="var(--mint)" opacity=".12"/><path d="${d}" fill="none" stroke="var(--mint)" stroke-width="2.5" stroke-linejoin="round"/>
 <circle cx="${x(pts.length-1)}" cy="${y(pts[pts.length-1])}" r="5" fill="var(--mint)"/>
 <text x="${W-R}" y="${H-6}" text-anchor="end" font-size="11" font-family="IBM Plex Mono,monospace" fill="var(--soft)">${st.length} picks · ${esc(st[0].Date)} to ${esc(st[st.length-1].Date)}</text></svg></div>`}

function sport(w){return w.Sport||S.sport}
function wList(){return (S.data.writeups||[]).filter(w=>sport(w)===S.sport).sort((a,b)=>a.Date<b.Date?1:-1)}
function vReads(){const ws=wList();const done=ws.filter(w=>pmRes(w["Post-mortem"]));const a={w:done.filter(w=>pmRes(w["Post-mortem"])==="WIN").length,l:done.filter(w=>pmRes(w["Post-mortem"])==="LOSS").length,p:done.filter(w=>pmRes(w["Post-mortem"])==="PUSH").length};
 return `<section class="intro"><span class="lab">${S.sport} breakdowns</span><h1>The why behind every main pick</h1>
 <p class="lede">The model's top picks each get a full write-up before the game: the player's role, the matchup, the game script, why the market looks off, what the sharp money is doing, and how it loses. After the game, the write-up gets graded too: was the reasoning right, not just the result.</p>${stamp()}</section>
 ${done.length?`<section class="chips4"><div class="sum lead"><span class="lab">Written-up picks</span><span class="v">${a.w}-${a.l}${a.p?"-"+a.p:""}</span><span class="s">graded with a post-mortem</span></div></section>`:""}
 <section class="wl">${ws.map(w=>{const res=pmRes(w["Post-mortem"]);return `<button class="wcard" data-go="${wid(w)}"><div class="wtop"><span class="lab">${esc(fmtDay(w.Date))} · ${esc(String(w.Game).replace("@"," @ "))}</span>${res?`<span class="res ${res[0]}">${res}</span>`:'<span class="tag pos">Pregame</span>'}</div>
  <h3>${esc(w.Headline)}</h3><span class="pmeta">${esc(w.Player)} · ${esc(w.Side)} ${esc(w.Line)} ${esc(mk(w.Market).toLowerCase())} · ${odds(w.Price)} at ${esc(w.Book)}</span></button>`}).join("")||`<div class="empty">The first ${S.sport} breakdowns land with the next board. ${S.sport==="NBA"?"NBA write-ups post by early afternoon on game days.":"NFL write-ups post Sunday morning and before the prime-time games."}</div>`}</section>`}
function paras(body){return String(body||"").split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean).map(p=>{const m=p.match(/^([A-Z][A-Za-z' ]{2,28}):\s*([\s\S]*)$/);
 const lab=m?m[1]:null,txt=m?m[2]:p;const kill=lab&&/kill/i.test(lab);
 return `<div class="sec${kill?" kill":""}">${lab?`<span class="lab">${esc(lab)}</span>`:""}${txt.split(/\n/).map(t=>`<p>${esc(t)}</p>`).join("")}</div>`}).join("")}
function vWriteup(){const w=(S.data.writeups||[]).find(x=>wid(x)===S.id);
 if(!w)return `<section class="empty"><span>That breakdown isn't here. It may still be loading, or the link is off by a letter.</span><button class="cta" data-go="reads">← All breakdowns</button></section>`;
 const us=pct(w["Our %"]),bk=pct(w["Book %"]);const n=us!=null?Math.round(us*50):null;const res=pmRes(w["Post-mortem"]);
 const pm=String(w["Post-mortem"]||"").replace(/^\s*(WIN|LOSS|PUSH)\s*[—–-]\s*/i,"");
 return `<section class="intro"><button class="back" data-go="reads">← All breakdowns</button>
 <span class="lab">${esc(w.Sport||S.sport)} · ${esc(fmtDay(w.Date))} · ${esc(String(w.Game).replace("@"," @ "))}</span><h1>${esc(w.Headline)}</h1></section>
 <article class="art">
 <div class="betbox"><span class="lab">The bet</span><div class="pwho">${esc(w.Player)}</div><div class="pbet">${esc(String(w.Side).toUpperCase())} ${esc(w.Line)} <small>${esc(mk(w.Market).toLowerCase())}</small></div>
  <div class="pmeta">${odds(w.Price)} at ${esc(w.Book)}</div>${sharpTag(w)?`<div class="tags">${sharpTag(w)}</div>`:""}${bars(w)}
  ${n!=null?`<div class="sim"><span class="lab">50 simulated games</span><div class="ticks" aria-hidden="true">${Array.from({length:50},(_,i)=>`<i class="${i<n?"h":""}"></i>`).join("")}</div><span class="simcap">About ${n} of 50 · break-even at ${odds(num(w.Price))} is ${Math.round(be(num(w.Price))*50)} of 50</span></div>`:""}</div>
 ${res?`<div class="pm ${res[0]}"><span class="lab">After the game · <span class="res big ${res[0]}">${res}</span></span><p>${esc(pm)}</p></div>`:""}
 ${paras(w.Body)}
 <div class="btnrow"><button class="cta" id="share">Copy link to share</button><a class="cta" href="https://x.com/TeejTradez" target="_blank" rel="noopener" style="text-decoration:none">Follow @TeejTradez</a></div>
 <p class="note">Model output, not betting advice. All odds are estimated. Prices move, so shop your number. 21+. 1-800-GAMBLER.</p></article>`}

function vMethod(){return `<section class="intro"><span class="lab">How it works</span><h1>Price it. Compare it. Grade it.</h1></section>
 <section class="prose">
 <div><span class="lab">01 · Its own number</span><p>For every player the model projects minutes and role first, then production per minute, adjusted for the matchup, the game total and injuries. That gives a range of outcomes, not just an average, so it knows how often a player really clears a line.</p></div>
 <div><span class="lab">02 · Against the book</span><p>Sportsbooks build their cut into every price. The model removes it to get the book's real number, using the least flattering method, then puts its own number beside it. A few points of difference is an edge. Less than that, it passes.</p></div>
 <div><span class="lab">03 · Humble about big gaps</span><p>When the model disagrees with the market by a lot, it's usually the one missing something. Big gaps get pulled back toward the market, and any huge edge needs a nameable reason, like an injury or a role change.</p></div>
 <div><span class="lab">04 · The sharp check</span><p>A good number isn't enough. Before anything becomes a pick, the model checks what the sharpest markets are doing: betting exchanges where pros trade against each other, and the sharpest books. If big money is on the other side, the pick is dropped, however good the model's number looks. Picks marked "Sharp-backed" have the sharp market on their side.</p></div>
 <div><span class="lab">05 · Graded every morning</span><p>Every pick is graded against the official box score at the price posted before the game, and every pick stays on the record. When a group of picks misses more than the model predicted, the model gets changed, publicly.</p></div>
 <div><span class="lab">Reading "57% vs 53%"</span><p>The model thinks the bet wins about 57 times in 100. The book's price, with its cut removed, says 53. At standard odds you need 52.4% to break even. Nobody hits 70% over a season. Anyone selling that is selling something.</p></div>
 <div class="btnrow"><a class="cta solid" href="https://teejtradez.substack.com" target="_blank" rel="noopener" style="text-decoration:none">Get the Free Money Sheet</a><a class="cta" href="https://x.com/TeejTradez" target="_blank" rel="noopener" style="text-decoration:none">Follow @TeejTradez</a></div>
 </section>`}


return view==="writeup"?vWriteup():view==="reads"?vReads():view==="game"?vGame():view==="edges"?vEdges():view==="record"?vRecord():vMethodBoard();
function vMethodBoard(){return view==="method"?vMethod():vBoard()}
}
