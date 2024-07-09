// Listen for copy events on the document
document.addEventListener('copy', (event) => {
  // Get the selected text
  const copiedText = document.getSelection().toString();

  try {
    // Send a message with the copied text to the background script
    chrome.runtime.sendMessage({ type: 'COPY_EVENT', text: copiedText });
  } catch (error) {
    console.error(error);
  }
});
