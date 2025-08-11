// contentScript.js
// Injects "Pin" buttons into ChatGPT UI (sidebar conversation items and chat header).
// Observes DOM changes to persistently add UI buttons.

const PIN_BTN_CLASS = 'gpt-pinner-btn';
const PIN_BTN_STYLE_ID = 'gpt-pinner-style';

// Utility: ensure styles once
function injectStyles() {
  if (document.getElementById(PIN_BTN_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PIN_BTN_STYLE_ID;
  style.textContent = `
    .${PIN_BTN_CLASS} {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.08);
      background: rgba(0,0,0,0.03);
      cursor: pointer;
      user-select: none;
    }
    .${PIN_BTN_CLASS}:hover { background: rgba(0,0,0,0.06); }
    .${PIN_BTN_CLASS} .star { font-weight: 700; margin-right: 2px; }
  `;
  document.head.appendChild(style);
}

// Get canonical conversation info from a conversation element or current page
function getConversationInfoFromUrl() {
  const url = location.href;
  // ChatGPT uses URLs like /c/<id> or /chat/<id> or /?model=...
  // We'll use the full href as unique key.
  const title = document.querySelector('title')?.innerText?.trim() || 'Chat';
  return { url, title };
}

// Add pin button near an element (if not already)
function addPinButton(targetElement, getPayloadFn) {
  if (!targetElement) return;
  // check existing
  if (targetElement.querySelector(`.${PIN_BTN_CLASS}`)) return;

  const btn = document.createElement('button');
  btn.className = PIN_BTN_CLASS;
  btn.title = "Pin this conversation";
  btn.innerHTML = `<span class="star">📌</span><span class="label">Pin</span>`;

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const payload = getPayloadFn();
    if (!payload || !payload.url) return;
    // query existing pins to toggle
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_PINS' }, resolve);
    });
    const pins = (response && response.pins) || [];
    const exists = pins.some(p => p.url === payload.url);
    if (exists) {
      chrome.runtime.sendMessage({ type: 'REMOVE_PIN', payload }, () => {
        // visual feedback
        btn.innerHTML = `<span class="star">📌</span><span class="label">Pin</span>`;
      });
    } else {
      chrome.runtime.sendMessage({ type: 'ADD_PIN', payload }, () => {
        btn.innerHTML = `<span class="star">✅</span><span class="label">Pinned</span>`;
        setTimeout(() => {
          btn.innerHTML = `<span class="star">📌</span><span class="label">Pin</span>`;
        }, 1200);
      });
    }
  });

  // insert at end
  targetElement.appendChild(btn);
}

// Try to inject Pin controls into the chat header (so user can pin current open conversation)
function injectPinIntoHeader() {
  // Chat header container (subject to site changes)
  // Try multiple selectors commonly used
  const headerSelectors = [
    'header', // fallback
    'div[class*="conversation"] header',
    'div[class*="chat"] header',
    'div.flex.items-center > div > div:last-child' // experimental
  ];
  let header = null;
  for (const s of headerSelectors) {
    header = document.querySelector(s);
    if (header) break;
  }
  if (!header) return;
  // create a container element near right side if possible
  const rightContainer = header.querySelector(':scope > div:last-child') || header;
  addPinButton(rightContainer, () => getConversationInfoFromUrl());
}

// Inject pin button into each conversation item in the sidebar
function injectPinsIntoSidebar() {
  // Conversation list items are usually <a> tags with href to conversation or buttons.
  // We'll search for anchor-like elements inside the sidebar.
  const sidebar = document.querySelector('nav[aria-label="Conversation history"], aside, div[role="navigation"]');
  if (!sidebar) return;

  // find candidate items
  const items = sidebar.querySelectorAll('a[href*="/chat/"], a[href*="/c/"], div[class*="conversation"] a, li a');
  items.forEach(a => {
    // find a good place to attach button inside the item (maybe the element itself)
    // if layout doesn't allow children, append a small wrapper
    addPinButton(a, () => {
      return {
        url: a.href,
        title: a.innerText.trim() || a.getAttribute('aria-label') || a.title || a.href
      };
    });
  });
}

// Observe the DOM so when ChatGPT updates or lazy-loads content we inject pins
function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    injectStyles();
    injectPinIntoHeader();
    injectPinsIntoSidebar();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  // run once
  injectStyles();
  injectPinIntoHeader();
  injectPinsIntoSidebar();
}

// When content script loads, run the observer
try {
  setupObserver();
} catch (err) {
  console.error('GPT Pinner content script error', err);
}
