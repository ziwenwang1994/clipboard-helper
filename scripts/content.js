document.addEventListener('copy', (event) => {
  const copiedText = document.getSelection().toString();
  try {
    chrome.runtime.sendMessage({ type: 'COPY_EVENT', text: copiedText });
  } catch (error) {
    console.error(error);
  }
});
