import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import store from 'store2'

export const useServiceWorkerStore = defineStore('counter', () => {
  const count = ref(0)
  const records = ref([])
  const indexedDb = ref(null)
  const recording = ref(store('recording_clipboard'))
  const doubleCount = computed(() => count.value * 2)

  window.chrome?.runtime.sendMessage({
    type: 'UPDATE_RECORDING',
    text: recording.value ? '1' : '0'
  })

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
  function setIndexedDb(db) {
    indexedDb.value = db
  }

  function setRecords(value) {
    records.value = value
  }

  function toggleRecording() {
    recording.value = !recording.value
    store('recording_clipboard', recording.value)
    window.chrome?.runtime.sendMessage({
      type: 'UPDATE_RECORDING',
      text: recording.value ? '1' : '0'
    })
  }

  /**
   * Deletes a record from the database.
   * @param {number} id - The ID of the record to delete.
   */
  async function deleteRecord(id) {
    const db = indexedDb.value || (await openDatabase())
    const transaction = db.transaction(['copiedTexts'], 'readwrite')
    const objectStore = transaction.objectStore('copiedTexts')
    objectStore.delete(id) // Delete the record with the given ID
    updateRecords();
  }

  /**
   * Deletes a record from the database.
   * @param {number} id - The ID of the record to delete.
   */
  async function clearRecords() {
    const db = indexedDb.value || (await openDatabase())
    const transaction = db.transaction(['copiedTexts'], 'readwrite')
    const objectStore = transaction.objectStore('copiedTexts')
    objectStore.clear() // Delete the record with the given ID
    updateRecords()
  }

  /**
 * Fetches all copied texts from the IndexedDB database.
 * @param {IDBDatabase} db - The database instance.
 * @returns {Promise<Array>} - A promise that resolves to an array of copied texts.
 */
  function fetchCopiedTexts() {
    return new Promise((resolve, reject) => {
      const transaction = indexedDb?.value?.transaction(["copiedTexts"], "readonly");
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
      const copiedTexts = await fetchCopiedTexts();
      setRecords(copiedTexts);
    } catch (error) {
      console.error("Error loading copied texts:", error);
    }
  };

  async function init() {
    indexedDb.value = await openDatabase();
    await updateRecords();
    document.addEventListener("DOMContentLoaded", updateRecords);
    
    // Listener for messages from other parts of the extension
    window.chrome?.runtime.onMessage.addListener((message) => {
      console.log("Listening...");
      if (message.type === "UPDATE_POPUP") {
        updateRecords(); // Update the display when a new text is copied
      }
    });
  }

  return {
    count,
    doubleCount,
    records,
    indexedDb,
    recording,
    deleteRecord,
    clearRecords,
    openDatabase,
    setRecords,
    setIndexedDb,
    toggleRecording,
    fetchCopiedTexts,
    updateRecords,
    init
  }
})
