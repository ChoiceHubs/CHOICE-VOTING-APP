// vote.js
async function ensureVotesInitialized() {
  if (!localStorage.getItem('votesData')) {
    const res = await fetch('events.json');
    const data = await res.json();
    const votesData = {};
    data.events.forEach(ev => {
      votesData[ev.id] = {};
      ev.nominees.forEach(n => votesData[ev.id][n.id] = 0);
    });
    localStorage.setItem('votesData', JSON.stringify(votesData));
  }
}

async function renderEvents() {
  await ensureVotesInitialized();
  const res = await fetch('events.json');
  const data = await res.json();
  const grid = document.getElementById('eventsGrid');
  grid.innerHTML = '';
  data.events.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${ev.name}</h3>
      <p>${ev.nominees.length} nominees</p>
      <button class="btn btn-primary" data-id="${ev.id}">View Nominees & Vote</button>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      window.location.href = `nominees.html?event=${encodeURIComponent(id)}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', renderEvents);