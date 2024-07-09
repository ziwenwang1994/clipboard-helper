let db;
let isRecording = { value: true };

/**
 * Opens the IndexedDB database and sets up the object store if necessary.
 * @returns {Promise<IDBDatabase>} - A promise that resolves to the database instance.
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CopyDatabase", 1);

    request.onerror = (event) => {
      reject(event.target.errorCode); // Reject the promise if there's an error
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Resolve the promise with the database instance
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore("copiedTexts", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("text", "text", { unique: false }); // Index for the copied text
      objectStore.createIndex("timestamp", "timestamp", { unique: false }); // Index for the timestamp
    };
  });
}

/**
 * Stores the copied text in the IndexedDB database.
 * @param {string} text - The text to store.
 */
async function storeCopiedText(text) {
  if (!db) db = await openDatabase(); // Ensure the database is open
  const transaction = db.transaction(["copiedTexts"], "readwrite");
  const objectStore = transaction.objectStore("copiedTexts");
  const request = objectStore.add({ text: text, timestamp: Date.now() });

  request.onsuccess = () => {
    chrome.runtime.sendMessage({ type: "UPDATE_POPUP", text: text }); // Send message to update the popup
  };

  request.onerror = (event) => {
    console.error("Error adding text to database:", event.target.errorCode);
  };
}

// Listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message) => {
  if(!isRecording.value) return;
  if (message.type === "COPY_EVENT") {
    const copiedText = message.text;
    storeCopiedText(copiedText); // Store the copied text
  }
});

// Listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "UPDATE_RECORDING") {
    isRecording.value = message.text === "1";
    console.log(isRecording.value)
  }
});

// Listener for the extension being installed
chrome.runtime.onInstalled.addListener(async () => {
  try {
    db = await openDatabase(); // Open the database
  } catch (error) {
    console.error(error);
  }

  // Listener for action button click
  chrome.action.onClicked.addListener((tab) => {
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

// Listener for the browser startup event
chrome.runtime.onStartup.addListener(async () => {
  try {
    db = await openDatabase(); // Open the database
  } catch (error) {
    console.error(error);
  }
});
