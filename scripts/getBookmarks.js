(function () {
  let bookmarks = [];
  let i = 0;
  let next;
  let variables = {};
  let isLastRequest = false;
  let helperData = {};

  const fetchBookmarks = async (bookmarks, next) => {
    let bookmarkCnt = 0;
    console.log("=> in fetchBookmarks =>", helperData);

    const bookmarkBaseUrl =
      "https://x.com/i/api/graphql/QUjXply7fA7fk05FRyajEg/Bookmarks";

    const features = {
      graphql_timeline_v2_bookmark_timeline: true,
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: true,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };

    while (!isLastRequest) {
      if (i === 0) {
        variables = {
          count: 20,
          includePromotedContent: false,
        };
      } else {
        variables = {
          count: 20,
          includePromotedContent: false,
          cursor: next,
        };
      }

      const url = `${bookmarkBaseUrl}?variables=${encodeURIComponent(
        JSON.stringify(variables)
      )}&features=${encodeURIComponent(JSON.stringify(features))}`;
      const response = await fetch(url, {
        method: "GET",
        headers: helperData.headers,
      });
      if (!response.ok) {
        console.dir(response);
        throw new Error("error fetching followers", response.status);
      } else {
        const data = await response.json();
        data?.data?.bookmark_timeline_v2?.timeline?.instructions?.forEach(
          (ele) => {
            if (
              ele.type === "TimelineTerminateTimeline" &&
              ele.direction === "Bottom"
            ) {
              isLastRequest = true;
            } else if (ele.type === "TimelineAddEntries" && ele.entries) {
              ele.entries.forEach((entry) => {
                entryType = entry?.content?.entryType;
                if (entryType === "TimelineTimelineItem") {
                  let tweetResults =
                    entry.content?.itemContent?.tweet_results?.result;
                  let bookmarkTextContent =
                    tweetResults?.legacy?.full_text ||
                    tweetResults?.tweet?.legacy?.full_text;
                  let tweetId = tweetResults?.rest_id;
                  let userScreenName =
                    tweetResults?.core?.user_results?.result?.legacy
                      ?.screen_name;
                  bookmarks.push({
                    bookmarkTextContent: bookmarkTextContent,
                    postURL: `https://x.com/${userScreenName}/status/${tweetId}`,
                    index: bookmarkCnt,
                  });
                  bookmarkCnt += 1;
                } else if (
                  entryType === "TimelineTimelineCursor" &&
                  entry?.content?.cursorType === "Bottom"
                ) {
                  if (next === entry?.content?.value) {
                    isLastRequest = true;
                  }
                  next = entry?.content?.value;
                  console.log("bottom", next);
                }
              });
            }
          }
        );
      }
      console.log("loop end: ", i);
      i++;
    }
  };

  const preprocessBookmarks = (bookmarks) => {
    return bookmarks.map((bookmark) => {
      let cleanTextContent = bookmark.bookmarkTextContent
        .replace(/https?:\/\/[^\s]+/g, "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "")
        .replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
        .trim();

      return {
        index: bookmark.index,
        bookmarkTextContent: cleanTextContent,
        postURL: bookmark.postURL,
      };
    });
  };

  const main = async () => {
    console.log("in getBookmarks.js");
    helperData = await chrome.storage.sync.get(["headers"]);
    await fetchBookmarks(bookmarks, next);
    console.log("here are the bookmarks");
    console.log(bookmarks);
    const preprocessedBookmarks = preprocessBookmarks(bookmarks);
    await chrome.storage.local.set({ bookmarks: preprocessedBookmarks });
    console.log("bookmarks stored", preprocessedBookmarks);
    await chrome.runtime.sendMessage({
        performAction: "bookmarksStored",
    });
  };

  main();
})();
