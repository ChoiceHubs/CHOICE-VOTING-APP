function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function ensureVotesInitializedForEvent(eventId) {
  if (!localStorage.getItem('votesData')) {
    const res = await fetch('events.json');
    const data = await res.json();
    const votesData = {};
    data.events.forEach(ev => {
      votesData[ev.id] = {};
      ev.nominees.forEach(n => votesData[ev.id][n.id] = 0);
    });
    localStorage.setItem('votesData', JSON.stringify(votesData));
  } else {
    const res = await fetch('events.json');
    const data = await res.json();
    const votesData = JSON.parse(localStorage.getItem('votesData'));
    data.events.forEach(ev => {
      if (!votesData[ev.id]) votesData[ev.id] = {};
      ev.nominees.forEach(n => {
        if (votesData[ev.id][n.id] === undefined) votesData[ev.id][n.id] = 0;
      });
    });
    localStorage.setItem('votesData', JSON.stringify(votesData));
  }
}

async function loadNomineesPage() {
  const eventId = getQueryParam('event');
  if (!eventId) {
    document.getElementById('eventTitle').textContent = 'Event not specified';
    return;
  }

  await ensureVotesInitializedForEvent(eventId);

  const res = await fetch('events.json');
  const data = await res.json();
  const ev = data.events.find(x => x.id === eventId);
  if (!ev) {
    document.getElementById('eventTitle').textContent = 'Event not found';
    return;
  }

  document.getElementById('eventTitle').textContent = ev.name;
  document.getElementById('eventSubtitle').textContent = `Vote once for one nominee in ${ev.name}`;

  const grid = document.getElementById('nomineesGrid');
  grid.innerHTML = '';

  const votedKey = `voted_${eventId}`;
  const hasVoted = !!localStorage.getItem(votedKey);

  ev.nominees.forEach(n => {
    const card = document.createElement('div');
    card.className = 'nominee-card';

    card.innerHTML = `
      <!-- <img src="${n.image}" alt="${n.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"/> -->
      <h4>${n.name}</h4>
      <button class="vote-btn" data-nom="${n.id}" ${hasVoted ? 'disabled' : ''}>Vote</button>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nomineeId = e.currentTarget.dataset.nom;
      if (localStorage.getItem(votedKey)) {
        alert('You have already voted for this event.');
        grid.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
        return;
      }

      const votes = JSON.parse(localStorage.getItem('votesData'));
      votes[eventId][nomineeId] = (votes[eventId][nomineeId] || 0) + 1;
      localStorage.setItem('votesData', JSON.stringify(votes));
      localStorage.setItem(votedKey, nomineeId);
      grid.querySelectorAll('.vote-btn').forEach(b => b.disabled = true);
      alert('Thank you — your vote has been recorded!');
    });
  });
}

document.addEventListener('DOMContentLoaded', loadNomineesPage);