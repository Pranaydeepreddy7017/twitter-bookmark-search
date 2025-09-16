# Twitter Bookmark Search

A Chrome extension that lets you export / search your Twitter bookmarks locally, bypassing some of the limitations of the official Twitter API.  
This tool scraps your bookmarked posts via internal Twitter network calls (using your browser session credentials) and stores them locally so you can search through them from a popup UI.

---

## Table of Contents
- [Features](#features)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Usage](#usage)  
- [How It Works](#how-it-works)  
- [Project Structure](#project-structure)  
- [Configuration](#configuration)  
- [Limitations and Known Issues](#limitations-and-known-issues)  
- [Future Improvements](#future-improvements)  
- [Security & Privacy](#security--privacy)  
- [Contributing](#contributing)  
- [License](#license)

---

## Features
- Retrieve your Twitter bookmarks even when the public API doesn’t return all of them.  
- Store bookmarks locally (in extension’s local storage) so that searches are fast and won’t repeatedly hit Twitter.  
- Basic search interface to search through bookmarked tweets (titles, content, etc.) via a popup.  
- Exports / viewing of results directly in the browser extension popup.  

---

## Getting Started

### Prerequisites
- Google Chrome (or any Chromium-based browser that supports Chrome extensions).  
- A Twitter account with bookmarks.  
- Basic familiarity with Chrome developer tools to inspect network, cookies, etc. (helpful).  

### Installation
1. Clone this repository to your local machine:  
   ```bash
   git clone https://github.com/Pranaydeepreddy7017/twitter-bookmark-search.git

2. Open Chrome and go to: chrome://extensions/

3. Enable Developer Mode (toggle on top-right).

4. Click Load unpacked and select the project folder you cloned. This will load the extension.

### Usage

1. Once loaded, click the extension icon (in Chrome toolbar) to open the popup.

2. To fetch your bookmarks:

    The extension uses internal Twitter network endpoints which may require your session cookies to be valid.

    It fetches bookmarks in batches. If you have many bookmarks, you may need to run the fetch multiple times so that all get stored in local storage.

3. Search: Once data is loaded, use the search box in the popup to search through your bookmarked tweets.

Optional: You can view bookmarks by navigating through local storage (for debugging) or export results (if you build that in).

##How It Works

The extension injects or uses scripts (popup.js, background.js) which identify Twitter’s internal network endpoints for fetching bookmarked tweets.

It uses browser’s cookies + network request parameters to mimic internal calls that Twitter uses.

Fetched data is then stored in local storage (Chrome extension’s local storage) in batches.

Search is done over that stored data in the popup.

## Project Structure
File / Folder	Description
manifest.json	Chrome extension manifest (permissions, background scripts, etc.).
background.js	Handles background tasks (e.g. repeated fetches, maybe triggers).
popup.html / popup.css / popup.js	UI for the extension popup (search box, display of bookmarks).
libs/	(If present) external libraries or helper functions.
scripts/	Additional scripts used (e.g. for data handling or batch fetching).
manifest_duplicate.json	Duplicate or backup of manifest (possible template or staging version).

## Configuration

You may need to add your own API keys or tokens (if required) in popup.js or related files.

Check that your Twitter session/cookies are active and valid in the browser, otherwise requests will fail.

## Limitations and Known Issues

Some bookmarks may not be retrieved automatically in one go; multiple fetch cycles might be needed.

Because this relies on non-public (internal) Twitter endpoints, changes in Twitter’s network structure may break this extension.

This is not an official Twitter-sanctioned way. Using internal endpoints may violate Twitter’s terms of service. Use at your own risk.

Rate-limiting or certain protections by Twitter may block or throttle fetches.

## Future Improvements

Add export functionality (e.g. download bookmarks as JSON, CSV).

Persistent or automatic sync when new bookmarks are added.

More advanced search (filters by date, media, etc.).

Better UI/UX enhancements.

Error handling and retries for network failures.

Support for other browsers (Firefox, Edge) if APIs match.
