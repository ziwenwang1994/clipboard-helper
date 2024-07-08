const textContainer = document.getElementById("copied-text");

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CopyDatabase", 1);

    request.onerror = (event) => {
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

function fetchCopiedTexts(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["copiedTexts"], "readonly");
    const objectStore = transaction.objectStore("copiedTexts");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.errorCode);
    };
  });
}

const updateRecords = async () => {
  try {
    const db = await openDatabase();
    const copiedTexts = await fetchCopiedTexts(db);

    if (copiedTexts.length > 0) {
      textContainer.innerHTML = "";
      copiedTexts.forEach((el) => {
        const record = document.createElement("div");
        record.classList.add("record");
        record.innerHTML = `<div class="content"><h3 class="date">${new Date(
          el.timestamp
        ).toLocaleString()}:</h3> <p>${el.text}</p></div>`;

        const buttons = document.createElement("div");
        buttons.classList.add("btns");

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.classList.add("del");
        del.onclick = () => deleteRecord(el.id);
        buttons.appendChild(del);

        const copyText = document.createElement("button");
        copyText.textContent = "Copy Text";
        copyText.onclick = async () => await navigator.clipboard.writeText(el.text);
        buttons.appendChild(copyText);

        record.appendChild(buttons);
        textContainer.appendChild(record);
      });
    } else {
      textContainer.textContent = "No copied text found.";
    }
  } catch (error) {
    console.error("Error loading copied texts:", error);
  }
};

document.addEventListener("DOMContentLoaded", updateRecords);

async function deleteRecord(id) {
  const db = await openDatabase();
  const transaction = db.transaction(["copiedTexts"], "readwrite");
  const objectStore = transaction.objectStore("copiedTexts");
  objectStore.delete(id);
  updateRecords();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_POPUP") {
    updateRecords();
  }
});
