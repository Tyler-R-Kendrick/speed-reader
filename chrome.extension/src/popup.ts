document.addEventListener('DOMContentLoaded', () => {
  const startReaderButton = document.getElementById('startReader');

  if (startReaderButton) {
    startReaderButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['dist/content.js']
          });
        }
      });
    });
  }
});
