# GPT Chat Pinner

## Install (unpacked)
1. Save the extension files into a folder (e.g. `gpt-chat-pinner`).
2. Open Chrome → `chrome://extensions/`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked**, choose the folder.
5. Open `https://chat.openai.com/` and sign in. The extension will inject Pin buttons.

## How to use
- In the chat list (left sidebar) or the chat header, click **Pin** to save a conversation.
- Open the extension icon (toolbar) to see your pinned chats. Click **Open** to open in a new tab.
- Unpin via the popup or by clicking Pin again in the UI.

## Notes / Troubleshooting
- The extension uses DOM selectors that can change when OpenAI updates their UI. If pins stop appearing, open `contentScript.js` and adjust selector strings in `injectPinIntoHeader()` and `injectPinsIntoSidebar()`.
- Data is stored in `chrome.storage.sync` (subject to size limits). If you prefer only local storage, change to `chrome.storage.local` in all files.
- This extension sends/receives messages only within the extension and stores only conversation title + url — it does NOT read or send the chat contents to external servers.

Enjoy!
