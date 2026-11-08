'use strict';

(() => {
  const firstMonth = 2026 * 12 + 8; // September 2026, inclusive.
  const today = new Date();
  const currentMonth = Math.max(firstMonth, today.getFullYear() * 12 + today.getMonth());
  const monthTitle = document.getElementById('month-title');
  const calendarDays = document.getElementById('calendar-days');
  const entriesList = document.getElementById('entries-list');
  const status = document.getElementById('calendar-status');
  const previous = document.getElementById('previous-month');
  const next = document.getElementById('next-month');
  let entries = [];
  let shownMonth = currentMonth;
  let loaded = false;
  let failed = false;

  const pad = value => String(value).padStart(2, '0');
  const monthKey = () => `${Math.floor(shownMonth / 12)}-${pad(shownMonth % 12 + 1)}`;
  const localDate = date => new Date(`${date}T12:00:00`);
  const longDate = date => localDate(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  function readHash() {
    const match = /^#month=(\d{4})-(0[1-9]|1[0-2])$/.exec(location.hash);
    shownMonth = match ? Math.max(firstMonth, Number(match[1]) * 12 + Number(match[2]) - 1) : currentMonth;
    render();
  }

  function navigate(month) {
    const target = Math.max(firstMonth, month);
    location.hash = `month=${Math.floor(target / 12)}-${pad(target % 12 + 1)}`;
  }

  function occasionLink(entry) {
    const link = document.createElement('a');
    link.href = entry.page;
    link.textContent = entry.title;
    link.className = `occasion ${entry.significance}`;
    link.setAttribute('aria-label', `${entry.title}, ${longDate(entry.date)}, ${entry.significance} occasion`);
    return link;
  }

  function render() {
    const year = Math.floor(shownMonth / 12);
    const month = shownMonth % 12;
    const monthLabel = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    monthTitle.textContent = monthLabel;
    previous.disabled = shownMonth <= firstMonth;
    previous.setAttribute('aria-label', shownMonth <= firstMonth ? 'September 2026 is the earliest month' : 'Previous month');
    next.disabled = shownMonth >= 9999 * 12 + 11;
    const monthEntries = entries.filter(entry => entry.date.startsWith(`${monthKey()}-`));
    const byDate = new Map();
    for (const entry of monthEntries) {
      if (!byDate.has(entry.date)) byDate.set(entry.date, []);
      byDate.get(entry.date).push(entry);
    }
    calendarDays.replaceChildren();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const slots = Math.ceil((offset + days) / 7) * 7;
    let row;
    for (let slot = 0; slot < slots; slot++) {
      if (slot % 7 === 0) {
        row = document.createElement('tr');
        calendarDays.append(row);
      }
      const cell = document.createElement('td');
      row.append(cell);
      const day = slot - offset + 1;
      if (day < 1 || day > days) {
        cell.className = 'outside-month';
        continue;
      }
      const date = `${monthKey()}-${pad(day)}`;
      const time = document.createElement('time');
      time.dateTime = date;
      time.textContent = day;
      time.setAttribute('aria-label', longDate(date));
      if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
        cell.classList.add('today');
        time.setAttribute('aria-current', 'date');
      }
      cell.append(time);
      for (const entry of byDate.get(date) || []) cell.append(occasionLink(entry));
    }
    entriesList.replaceChildren();
    for (const entry of monthEntries) {
      const item = document.createElement('li');
      item.className = `entry-card ${entry.significance}`;
      const time = document.createElement('time');
      time.dateTime = entry.date;
      time.textContent = localDate(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const content = document.createElement('div');
      const label = document.createElement('p');
      label.className = 'eyebrow';
      label.textContent = `${entry.significance} occasion`;
      const heading = document.createElement('h3');
      heading.append(occasionLink(entry));
      const summary = document.createElement('p');
      summary.textContent = entry.summary;
      content.append(label, heading, summary);
      item.append(time, content);
      entriesList.append(item);
    }
    document.getElementById('empty-month').hidden = !loaded || monthEntries.length > 0;
    status.hidden = loaded;
    status.textContent = failed ? 'The occasions could not be loaded. Please refresh to try again.' : 'Loading occasions…';
    document.getElementById('entries-title').textContent = `${new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long' })}’s stories`;
  }

  previous.addEventListener('click', () => navigate(shownMonth - 1));
  next.addEventListener('click', () => navigate(shownMonth + 1));
  document.getElementById('current-month').addEventListener('click', () => navigate(currentMonth));
  window.addEventListener('hashchange', readHash);
  readHash();
  fetch('entries.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Expected an entries array');
      entries = data.slice().sort((a, b) => a.date.localeCompare(b.date));
      loaded = true;
      render();
    })
    .catch(() => { failed = true; render(); });
})();
