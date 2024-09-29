console.log("running getProfile.js")

var profileBtn = document.querySelector("[aria-label='Profile']")
var userName = profileBtn.pathname.substring(1)
chrome.storage.sync.set({ "userName": userName })
chrome.runtime.sendMessage({
    "performAction": "fetchHeadersAndCookies"
})