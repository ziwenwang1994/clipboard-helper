// Get the container element where the copied texts will be displayed
const textContainer = document.getElementById("copied-text");

/**
 * Opens the IndexedDB database.
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
  });
}

/**
 * Fetches all copied texts from the IndexedDB database.
 * @param {IDBDatabase} db - The database instance.
 * @returns {Promise<Array>} - A promise that resolves to an array of copied texts.
 */
function fetchCopiedTexts(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["copiedTexts"], "readonly");
    const objectStore = transaction.objectStore("copiedTexts");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result); // Resolve with the array of copied texts
    };

    request.onerror = (event) => {
      reject(event.target.errorCode); // Reject the promise if there's an error
    };
  });
}

/**
 * Updates the display with the copied texts from the database.
 */
const updateRecords = async () => {
  try {
    const db = await openDatabase();
    const copiedTexts = await fetchCopiedTexts(db);

    if (copiedTexts.length > 0) {
      textContainer.innerHTML = ""; // Clear the existing content
      copiedTexts.forEach((el) => {
        // Create a new record element for each copied text
        const record = document.createElement("div");
        record.classList.add("record");
        record.innerHTML = `<div class="content"><h3 class="date">${new Date(
          el.timestamp
        ).toLocaleString()}:</h3> <p>${el.text}</p></div>`;

        const buttons = document.createElement("div");
        buttons.classList.add("btns");

        // Create a delete button for each record
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.classList.add("del");
        del.onclick = () => deleteRecord(el.id); // Set the delete function
        buttons.appendChild(del);

        // Create a copy text button for each record
        const copyText = document.createElement("button");
        copyText.textContent = "Copy Text";
        copyText.onclick = async () => await navigator.clipboard.writeText(el.text); // Set the copy function
        buttons.appendChild(copyText);

        record.appendChild(buttons);
        textContainer.appendChild(record);
      });
    } else {
      textContainer.textContent = "No copied text found."; // Display message if no copied texts found
    }
  } catch (error) {
    console.error("Error loading copied texts:", error);
  }
};

// Update records when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", updateRecords);

/**
 * Deletes a record from the database.
 * @param {number} id - The ID of the record to delete.
 */
async function deleteRecord(id) {
  const db = await openDatabase();
  const transaction = db.transaction(["copiedTexts"], "readwrite");
  const objectStore = transaction.objectStore("copiedTexts");
  objectStore.delete(id); // Delete the record with the given ID
  updateRecords(); // Refresh the display
}

// Listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_POPUP") {
    updateRecords(); // Update the display when a new text is copied
  }
});
