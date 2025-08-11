// popup.js
const pinsList = document.getElementById('pinsList');
const emptyEl = document.getElementById('empty');
const openAllBtn = document.getElementById('openAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

function renderPins(pins) {
  pinsList.innerHTML = '';
  if (!pins || pins.length === 0) {
    emptyEl.style.display = 'block';
    openAllBtn.disabled = true;
    clearAllBtn.disabled = true;
    return;
  }
  emptyEl.style.display = 'none';
  openAllBtn.disabled = false;
  clearAllBtn.disabled = false;

  pins.forEach(p => {
    const item = document.createElement('div');
    item.className = 'pin-item';

    const main = document.createElement('div');
    main.className = 'pin-main';

    const title = document.createElement('div');
    title.className = 'pin-title';
    title.textContent = p.title || p.url;

    const url = document.createElement('div');
    url.className = 'pin-url';
    url.textContent = p.url;

    main.appendChild(title);
    main.appendChild(url);

    const actions = document.createElement('div');
    actions.className = 'pin-actions';

    const openBtn = document.createElement('button');
    openBtn.className = 'small';
    openBtn.textContent = 'Open';
    openBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: p.url });
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'small';
    removeBtn.textContent = 'Unpin';
    removeBtn.addEventListener('click', async () => {
      chrome.runtime.sendMessage({ type: 'REMOVE_PIN', payload: { url: p.url } }, (resp) => {
        // storage change will trigger re-render via getPins below
        loadPins();
      });
    });

    actions.appendChild(openBtn);
    actions.appendChild(removeBtn);

    item.appendChild(main);
    item.appendChild(actions);
    pinsList.appendChild(item);
  });
}

function loadPins() {
  chrome.runtime.sendMessage({ type: 'GET_PINS' }, (resp) => {
    if (!resp || !resp.pins) {
      renderPins([]);
      return;
    }
    renderPins(resp.pins);
  });
}

openAllBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'GET_PINS' }, (resp) => {
    const pins = resp.pins || [];
    pins.forEach(p => chrome.tabs.create({ url: p.url }));
  });
});

clearAllBtn.addEventListener('click', () => {
  if (!confirm('Remove all pinned chats?')) return;
  chrome.storage.sync.set({ pins: [] }, () => {
    loadPins();
  });
});

// Listen for storage changes (so if content script added/removed pins, popup updates)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.pins) {
    loadPins();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadPins();
});
