import { GoogleGenerativeAI } from "./libs/index.mjs";

let bookmarks = [];
const BATCH_SIZE = 50;

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const displayBookmarks = (results) => {
  const bookmarksList = document.getElementById("bookmarksList");
  bookmarksList.innerHTML = "";

  if (results.length > 0) {
    results.forEach((bookmark) => {
      const bookmarkItem = document.createElement("div");
      bookmarkItem.classList.add("bookmark");

      const summary = document.createElement("div");
      summary.textContent = bookmark.postSummary;
      summary.classList.add("summary");

      const postLink = document.createElement("a");
      postLink.href = bookmark.postURL;
      postLink.target = "_blank";
      postLink.textContent = bookmark.postURL;

      bookmarkItem.appendChild(summary);
      bookmarkItem.appendChild(postLink);

      bookmarksList.appendChild(bookmarkItem);
    });
  } else {
    bookmarksList.textContent = "No matching bookmarks found.";
  }
};

const performSearchWithGemini = async (searchQuery) => {
  const genAI = new GoogleGenerativeAI(
    ""
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const bookmarkBatches = chunkArray(bookmarks, BATCH_SIZE);

  let finalResults = [];

  const searchBtn = document.getElementById("searchBtn");
  searchBtn.value = "Searching...";
  searchBtn.disabled = true;

  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  for (const batch of bookmarkBatches) {
    const prompt = `
    Here is a list of bookmarks in JSON format: ${JSON.stringify(batch)}
    Return the bookmarks that match or relate to this search query/topic/string -> "${searchQuery}"
    Use this JSON schema for return type:
    Post = {'postURL': string, 'postSummary': string}
    Return: Array<Post>
    Return empty array if no bookmarks are found.
    Use double quotes in JSON schema, not single quotes.
    Also, dont return JSON in \`\`\`json. Just return only the array in the response. No extra characters.
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      console.log(responseText);
      const batchResults = JSON.parse(responseText);
      console.log("Batch result: ", batchResults);
      finalResults.push(...batchResults);
    } catch (error) {
      console.error("Error during AI model call for batch: ", batch, error);
    }
  }

  const promptForFinalResults = `
    Here is a list of bookmarks in JSON format: ${JSON.stringify(finalResults)}
    Return the bookmarks that closely match/relate to this search query from user -> "${searchQuery}"
    Use this JSON schema for return type:
    Post = {'postURL': string, 'postSummary': string}
    Return: Array<Post>
    Return empty array if no bookmarks are found.
    Use double quotes in JSON schema, not single quotes.
    Also, dont return JSON in \`\`\`json. Just return only the array in the response. No extra characters.
    `;

    let filteredBookmarks = []

    try {
      const result = await model.generateContent(promptForFinalResults);
      const responseText = await result.response.text();
      console.log(responseText);
      filteredBookmarks = JSON.parse(responseText);
      console.log("Filtered bookmarks from final results: ", filteredBookmarks);
    } catch (error) {
      console.error("Error during AI model call for final results: ", finalResults, error);
    }
  

  searchBtn.value = "Search";
  searchBtn.disabled = false;
  loader.classList.add("hidden");

  console.log("Final aggregated results from all batches: ", filteredBookmarks);
  displayBookmarks(filteredBookmarks);
};

const handleBookmarksChange = () => {
  const searchBtn = document.getElementById("searchBtn");
  const loader = document.getElementById("loader");
  searchBtn.disabled = false;
  loader.classList.add("hidden");
};

const handleSearch = async (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("searchInput");
  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    await performSearchWithGemini(searchQuery);
  } else {
    console.log("Please enter a valid search term.");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const twitterUrls = ["https://x.com"];
  chrome.tabs.query(
    {
      url: ["*://*.x.com/*"],
    },
    (tabs) => {
      console.log(tabs);
      if (tabs[0]?.url?.startsWith(twitterUrls[0])) {
        const fetchBkMrkBtn = document.getElementById("loadBookmarksBtn");
        const searchBtn = document.getElementById("searchBtn");
        const loader = document.getElementById("loader");
        console.log(fetchBkMrkBtn);
        fetchBkMrkBtn.addEventListener("click", async () => {
          searchBtn.disabled = true;
          loader.classList.remove("hidden");
          await chrome.storage.sync.clear();
          await chrome.runtime.sendMessage({
            performAction: "fetchHeadersAndCookies",
          });
        });

        searchBtn.addEventListener("click", handleSearch);
      }
    }
  );

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.performAction, "received message");

    if (request.performAction === "bookmarksStored") {
      chrome.tabs.query(
        {
          url: ["*://*.x.com/*"],
        },
        async (tabs) => {
          if (tabs[0]) {
            const tab = tabs[0];
            console.log("active tab details => ", tab);
            const data = await chrome.storage.local.get(["bookmarks"]);
            bookmarks = Array.isArray(data?.bookmarks) ? data?.bookmarks : [];
            console.log("received bookmarks message returning them", bookmarks);
            handleBookmarksChange();
          }
        }
      );
    }
  });
});
