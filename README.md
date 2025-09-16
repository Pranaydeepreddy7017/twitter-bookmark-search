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
