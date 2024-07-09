// Listen for copy events on the document
document.addEventListener('copy', () => {
  // Get the selected text
  const copiedText = document.getSelection().toString();

  try {
    // Send a message with the copied text to the background script
    window.chrome.runtime.sendMessage({ type: 'COPY_EVENT', text: copiedText });
  } catch (error) {
    console.error(error);
  }
});
