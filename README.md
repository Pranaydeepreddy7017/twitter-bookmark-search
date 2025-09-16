Twitter Bookmark Search

A Chrome extension that lets you export / search your Twitter bookmarks locally, bypassing some of the limitations of the official Twitter API.
This tool scraps your bookmarked posts via internal Twitter network calls (using your browser session credentials) and stores them locally so you can search through them from a popup UI.

Table of Contents

Features

Getting Started

Prerequisites

Installation

Usage

How It Works

Project Structure

Configuration

Limitations and Known Issues

Future Improvements

Security & Privacy

Contributing

License

Features

Retrieve your Twitter bookmarks even when the public API doesn’t return all of them.

Store bookmarks locally (in extension’s local storage) so that searches are fast and won’t repeatedly hit Twitter.

Basic search interface to search through bookmarked tweets (titles, content, etc.) via a popup.

Exports / viewing of results directly in the browser extension popup.

Getting Started
Prerequisites

Google Chrome (or any Chromium-based browser that supports Chrome extensions).

A Twitter account with bookmarks.

Basic familiarity with Chrome developer tools to inspect network, cookies, etc. (helpful).

Installation

Clone this repository to your local machine:

git clone https://github.com/Pranaydeepreddy7017/twitter-bookmark-search.git


Open Chrome and go to: chrome://extensions/

Enable Developer Mode (toggle on top-right).

Click “Load unpacked” and select the project folder you cloned. This will load the extension.

Usage

Once loaded, click the extension icon (in Chrome toolbar) to open the popup.

To fetch your bookmarks:

The extension uses internal Twitter network endpoints which may require your session cookies to be valid.

It fetches bookmarks in batches. If you have many bookmarks, you may need to run the fetch multiple times so that all get stored in local storage.

Search: Once data is loaded, use the search box in the popup to search through your bookmarked tweets.

Optional: You can view bookmarks by navigating through local storage (for debugging) or export results (if you build that in).

How It Works

The extension injects or uses scripts (popup.js, background.js) which identify Twitter’s internal network endpoints for fetching bookmarked tweets.

It uses browser’s cookies + network request parameters to mimic internal calls that Twitter uses.

Fetched data is then stored in local storage (Chrome extension’s local storage) in batches.

Search is done over that stored data in the popup.

Project Structure
File / Folder	Description
manifest.json	Chrome extension manifest (permissions, background scripts, etc.).
background.js	Handles background tasks (e.g. repeated fetches, maybe triggers).
popup.html / popup.css / popup.js	UI for the extension popup (search box, display of bookmarks).
libs/	(If present) external libraries or helper functions.
scripts/	Additional scripts used (e.g. for data handling or batch fetching).
manifest_duplicate.json	Duplicate or backup of manifest (possible template or staging version).
Configuration

You’ll need to add your own API or keys (if any) in popup.js or related files — e.g. Gemini API key (if this is indeed used).

Check that your Twitter session/cookies are active and valid in the browser, otherwise requests will fail.

Limitations and Known Issues

Some bookmarks may not be retrieved automatically in one go; multiple fetch cycles might be needed.

Because this relies on non-public (internal) Twitter endpoints, changes in Twitter’s network structure may break this extension.

This is not an official Twitter-sanctioned way. Using internal endpoints may violate Twitter’s terms of service. Use at your own risk.

Rate-limiting or certain protections by Twitter may block or throttle fetches.

Future Improvements

Add export functionality (e.g. download bookmarks as JSON, CSV).

Persistent or automatic sync when new bookmarks are added.

More advanced search (filters by date, media, etc.).

Better UI/UX enhancements.

Error handling and retries for network failures.

Support for other browsers (Firefox, Edge) if APIs match.

Security & Privacy

The extension uses your browser’s session / cookies to authenticate to Twitter — this means you should ensure you trust the code.

Data is stored locally — bookmarks are not sent to any external server (unless you modify the code).

Keep your system and browser updated for security patches.
