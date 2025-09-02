function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function safeId(val) {
  return String(val).replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

async function loadResultsPage() {
  const eventId = getQueryParam('event');
  if (!eventId) return;

  const res = await fetch('events.json');
  const data = await res.json();
  const ev = data.events.find(x => x.id === eventId);
  if (!ev) return;

  document.getElementById('eventTitle').textContent = `${ev.name} Results`;
  const eventResults = document.getElementById('eventResults');
  eventResults.innerHTML = '';

  const votesData = JSON.parse(localStorage.getItem('votesData') || '{}');
  const evVotes = votesData[eventId] || {};
  const labels = ev.nominees.map(n => n.name);
  const dataVals = ev.nominees.map(n => evVotes[n.id] || 0);
  const total = dataVals.reduce((s,v)=>s+v,0);

  // nominee list with counts + percentages
  const listWrap = document.createElement('div');
  listWrap.className = 'results-list';
  ev.nominees.forEach((n,idx)=>{
    const percent = total?((dataVals[idx]/total)*100).toFixed(1):0;
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <img src="${n.image}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
      <div class="meta">
        <strong>${n.name}</strong>
        <small>${dataVals[idx]} votes • ${percent}%</small>
      </div>
    `;
    listWrap.appendChild(item);
  });
  eventResults.appendChild(listWrap);

  // charts
  const chartDiv = document.createElement('div');
  chartDiv.style.marginTop='12px';
  chartDiv.className='charts';
  const barCanvasId=`bar-${safeId(ev.id)}`;
  const pieCanvasId=`pie-${safeId(ev.id)}`;
  chartDiv.innerHTML=`
    <div style="flex:1;min-width:300px"><canvas id="${barCanvasId}"></canvas></div>
    <div style="flex:1;min-width:300px"><canvas id="${pieCanvasId}"></canvas></div>
  `;
  eventResults.appendChild(chartDiv);

  const colors = ["#3498db","#e74c3c","#2ecc71","#f39c12","#9b59b6","#1abc9c","#34495e","#d35400","#7f8c8d","#c0392b"];
  const barCtx=document.getElementById(barCanvasId).getContext('2d');
  const pieCtx=document.getElementById(pieCanvasId).getContext('2d');

  new Chart(barCtx,{
    type:'bar',
    data:{labels,datasets:[{label:'Votes',data:dataVals,backgroundColor:colors}]},
    options:{responsive:true,plugins:{legend:{display:false}}}
  });

  new Chart(pieCtx,{
    type:'pie',
    data:{labels,datasets:[{data:dataVals,backgroundColor:colors}]},
    options:{responsive:true}
  });
}

document.addEventListener('DOMContentLoaded', loadResultsPage);