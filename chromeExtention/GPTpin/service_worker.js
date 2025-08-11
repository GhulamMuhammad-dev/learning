// service_worker.js
// Background service worker: handles simple messaging and central storage updates.

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'ADD_PIN') {
    chrome.storage.sync.get({ pins: [] }, (res) => {
      const pins = res.pins || [];
      // prevent duplicates by url
      if (!pins.find(p => p.url === msg.payload.url)) {
        pins.unshift(msg.payload); // newest first
        chrome.storage.sync.set({ pins }, () => {
          sendResponse({ success: true, pins });
        });
      } else {
        sendResponse({ success: false, reason: 'already_pinned' });
      }
    });
    return true; // indicate async response
  }

  if (msg.type === 'REMOVE_PIN') {
    chrome.storage.sync.get({ pins: [] }, (res) => {
      const pins = (res.pins || []).filter(p => p.url !== msg.payload.url);
      chrome.storage.sync.set({ pins }, () => {
        sendResponse({ success: true, pins });
      });
    });
    return true;
  }

  if (msg.type === 'GET_PINS') {
    chrome.storage.sync.get({ pins: [] }, (res) => {
      sendResponse({ success: true, pins: res.pins || [] });
    });
    return true;
  }
});
