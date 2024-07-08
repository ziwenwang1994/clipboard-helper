# Clipboard Helper

Clipboard Helper is a Chrome extension that records every copy action made in your browser, storing the copied text in IndexedDB. This tool helps users keep track of all their copied content across different tabs.

## Features

- **Record Copies**: Automatically record every copy action in your browser.
- **View History**: Display a history of all copied text with timestamps.
- **Manage Copies**: Delete individual copy records or copy text back to the clipboard.
- **Persistent Storage**: Uses IndexedDB to store copy history securely and persistently.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ziwenwang4900/clipboard-helper.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned the repository.

## Usage

1. Once installed, the Clipboard Helper extension icon will appear in your Chrome toolbar.
2. Click on the icon to open the extension popup.
3. The popup will display a list of copied text with timestamps.
4. You can delete individual records or copy the text back to the clipboard using the respective buttons.

## Files

- `manifest.json`: Configuration file for the Chrome extension.
- `scripts/background.js`: Service worker script to manage background tasks.
- `scripts/content.js`: Content script to capture copy events on web pages.
- `index.html`: The popup HTML file displayed when the extension icon is clicked.
- `styles/styles.css`: CSS file for styling the popup.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

![demo](image.png)

## Contact

For any questions or suggestions, please open an issue or contact ziwenw4900@gmail.com.