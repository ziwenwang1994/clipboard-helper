let db;

// 打开 IndexedDB 数据库
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CopyDatabase", 1);

    request.onerror = (event) => {
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore("copiedTexts", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("text", "text", { unique: false });
      objectStore.createIndex("timestamp", "timestamp", { unique: false });
    };
  });
}

async function storeCopiedText(text) {
  if(!db) db = await openDatabase();
  const transaction = db.transaction(["copiedTexts"], "readwrite");
  const objectStore = transaction.objectStore("copiedTexts");
  const request = objectStore.add({ text: text, timestamp: Date.now() });

  request.onsuccess = () => {
    console.log("Text added to database:", text);
    chrome.runtime.sendMessage({ type: "UPDATE_POPUP", text: text });
  };

  request.onerror = (event) => {
    console.error("Error adding text to database:", event.target.errorCode);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "COPY_EVENT") {
    const copiedText = message.text;
    console.log("Copied text:", copiedText);
    storeCopiedText(copiedText);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  try {
    db = await openDatabase();
  } catch (error) {
    console.error(error);
  }

  chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "popup",
      width: 400,
      height: 400,
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        console.log("Content script injected");
      }
    );
  });
});

chrome.runtime.onStartup.addListener(async () => {
  try {
    db = await openDatabase();
  } catch (error) {
    console.error(error);
  }
});
