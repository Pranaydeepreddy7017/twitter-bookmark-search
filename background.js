const twitterUrl = "https://x.com";

getHeadersObj = (headers, cookies) => {
  const headersObj = {}
  const required = ["x-csrf-token", "authorization"]
  headers.forEach((header) => {
      if (required.includes(header.name.toLowerCase())) {
          headersObj[header.name.toLowerCase()] = header.value
      }
  })
  headersObj["content-type"] = "application/json"
  headersObj["cookie"] = this.cookCookies(cookies)
  return headersObj
}

cookCookies = (cookies) => {
  let cookieStr = ""
  cookies.forEach((cookie) => {
      cookieStr += cookie.name
      cookieStr += "="
      cookieStr += cookie.value
      cookieStr += "; "
  })
  cookieStr = cookieStr.substring(0, cookieStr.length-2)
  return cookieStr
}

// fires when the extension icon aka the action icon is clicked
chrome.action.onClicked.addListener(async () => {
  await chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.performAction, "received message")

  switch (request.performAction) {
    case "fetchHeadersAndCookies":
      chrome.tabs.query({
        url: ["*://*.x.com/*"]
      }, (tabs) => {
        if (tabs[0]) {
          const tab = tabs[0]
          console.log("active tab details => ", tab)
          if (tab.url.startsWith(twitterUrl)) {
            const host = (new URL(tab.url)).hostname
            chrome.cookies.getAll({domain: host}, (cookies) => {
              console.log("Cookies cooked, here are the cookies => ", cookies)
              chrome.storage.sync.set({ cookies: cookies}).then(async () => {
                console.log("stored cookies in chrome storage")
                fetchHeaders(cookies);
                chrome.storage.onChanged.addListener((changes, namespace) => {
                  if (namespace === "sync" && changes.headers?.newValue) {
                    console.log("ready to gooo!")
                    chrome.scripting.executeScript(
                      {
                        target: {
                          tabId: tab.id
                        },
                        files: ["scripts/getBookmarks.js"]
                      }
                    )
                  }
                })
              })
            })
          }
        }
      })
      
      break;
    default:
      break;
  }
});

 const fetchHeaders = (cookies) => {
  let fired = false
  chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    if (!fired) {
      console.log("details of the request")
      console.dir(details)
      const headers = this.getHeadersObj(details.requestHeaders, cookies)
      chrome.storage.sync.set({ headers: headers}).then(() => {
        console.log("stored the headers required")
      })
    }
    fired = true
  }, {urls: ["*://*.x.com/*"]}, ["requestHeaders"])
}