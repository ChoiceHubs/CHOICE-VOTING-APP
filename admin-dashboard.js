async function ensureVotesInitializedGlobal() {
  if (!localStorage.getItem('votesData')) {
    const r = await fetch('events.json');
    const dat = await r.json();
    const votesData = {};
    dat.events.forEach(ev => {
      votesData[ev.id] = {};
      ev.nominees.forEach(n => votesData[ev.id][n.id] = 0);
    });
    localStorage.setItem('votesData', JSON.stringify(votesData));
  }
}

async function loadAdminDashboard() {
  await ensureVotesInitializedGlobal();
  const res = await fetch('events.json');
  const data = await res.json();

  const eventsContainer = document.getElementById('adminEvents');
  const eventResults = document.getElementById('eventResults');

  eventsContainer.innerHTML = '';
  eventResults.innerHTML = '<p>Select an event to view results</p>';

  data.events.forEach(ev => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.marginBottom = '6px';

    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.textContent = ev.name;
    btn.dataset.id = ev.id;
    btn.addEventListener('click', () => showResultsForEvent(ev));

    const resetBtn = document.createElement('button');
    resetBtn.className = 'danger-btn';
    resetBtn.textContent = 'Reset Votes';
    resetBtn.addEventListener('click', () => {
      if (!confirm(`Are you sure you want to reset votes for ${ev.name}?`)) return;

      const votesData = JSON.parse(localStorage.getItem('votesData'));
      ev.nominees.forEach(n => {
        votesData[ev.id][n.id] = 0;
      });
      localStorage.setItem('votesData', JSON.stringify(votesData));

      // Clear voted flag for this event
      localStorage.removeItem(`voted_${ev.id}`);

      alert(`Votes for ${ev.name} have been reset!`);
      loadAdminDashboard();
    });

    div.appendChild(btn);
    div.appendChild(resetBtn);
    eventsContainer.appendChild(div);
  });
}

function showResultsForEvent(ev) {
  const votes = JSON.parse(localStorage.getItem('votesData'));
  const eventVotes = votes[ev.id];
  const totalVotes = Object.values(eventVotes).reduce((a,b)=>a+b,0);

  let html = `<h3>${ev.name} Results (${totalVotes} votes)</h3>`;
  html += '<div class="event-results">';
  ev.nominees.forEach(n => {
    const count = eventVotes[n.id] || 0;
    html += `
      <div class="result-item">
        <!-- <img src="${n.image}" onerror="this.src='https://via.placeholder.com/64?text=No+Img'" /> -->
        <div class="meta">
          <strong>${n.name}</strong>
          Votes: ${count} (${totalVotes ? ((count/totalVotes)*100).toFixed(1)+'%' : '0%'})
        </div>
      </div>
    `;
  });
  html += '</div>';

  html += `<div class="charts" style="display:block;">
      <canvas id="barChart"></canvas>
      <canvas id="pieChart" style="display:block; margin-top:16px;"></canvas>
    </div>`;

  document.getElementById('eventResults').innerHTML = html;

  const ctx1 = document.getElementById('barChart').getContext('2d');
  const ctx2 = document.getElementById('pieChart').getContext('2d');
  const labels = ev.nominees.map(n => n.name);
  const dataVals = ev.nominees.map(n => eventVotes[n.id] || 0);

  new Chart(ctx1, { 
    type: 'bar', 
    data: { labels, datasets: [{ label: 'Votes', data: dataVals, backgroundColor: '#38bdf8' }] } 
  });

  new Chart(ctx2, { 
    type: 'pie', 
    data: { labels, datasets: [{ data: dataVals, backgroundColor: labels.map((_,i)=>`hsl(${i*36},70%,60%)`)}] } 
  });
}

document.getElementById('changePassBtn').addEventListener('click', () => {
  document.getElementById('passPrompt').style.display = 'flex';
});
document.getElementById('cancelChange').addEventListener('click', () => {
  document.getElementById('passPrompt').style.display = 'none';
});
document.getElementById('saveChange').addEventListener('click', () => {
  const newP = document.getElementById('newPass').value;
  const conf = document.getElementById('confirmPass').value;
  if (!newP || newP !== conf) {
    document.getElementById('passMsg').textContent = 'Passwords do not match!';
    return;
  }
  localStorage.setItem('admin_password', newP);
  document.getElementById('passPrompt').style.display = 'none';
  alert('Password changed successfully');
});

document.addEventListener('DOMContentLoaded', loadAdminDashboard);
