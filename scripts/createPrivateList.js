// dont change var to const to avoid error during runtime
var createListGetUserId = async () => {
    const helperData = await chrome.storage.sync.get(["listName", "headers"])
    const reqUrl = 'https://x.com/i/api/graphql/P51ZB9632Fy0Cv3LdqMNwg/CreateList'
    const body = {
        variables: {
          isPrivate: true,
          name: helperData.listName ? helperData.listName : "unfollowlist",
          description: ''
        },
        features: {
          rweb_tipjar_consumption_enabled: true,
          responsive_web_graphql_exclude_directive_enabled: true,
          verified_phone_label_enabled: true,
          responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
          responsive_web_graphql_timeline_navigation_enabled: true
        },
        queryId: 'P51ZB9632Fy0Cv3LdqMNwg'
    };
    const response = await fetch(reqUrl, {
        method: "POST",
        headers: helperData.headers,
        body: JSON.stringify(body)
    })
    const data = await response.json()
    // console.log("list created", data)
    const restId = data?.data?.list?.user_results?.result?.rest_id
    const createdListId = data?.data?.list?.id_str
    await chrome.storage.sync.set({ userRestId: restId })
    await chrome.storage.sync.set({ createdListId: createdListId })
    console.log(restId, createdListId)
    chrome.runtime.sendMessage({
        "performAction": "fetchFollowers"
    })
}

createListGetUserId()