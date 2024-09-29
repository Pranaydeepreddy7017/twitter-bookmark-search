(function () {
  let people = [];
  let i = 0;
  let next;
  let variables = {};
  let isLastRequest = false;
  let helperData = {};

  const fetchFollowers = async (people, next) => {
    console.log("=> in fetchFollowers =>", helperData);

    const baseUrl =
      "https://x.com/i/api/graphql/FG7gWUco2ITV3KDa4_XUHQ/Following";

    const features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: true,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
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
          userId: helperData.userRestId,
          count: 20,
          includePromotedContent: false,
        };
      } else {
        variables = {
          userId: helperData.userRestId,
          count: 20,
          includePromotedContent: false,
          cursor: next,
        };
      }

      const url = `${baseUrl}?variables=${encodeURIComponent(
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
        data?.data?.user?.result?.timeline?.timeline?.instructions?.forEach(
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
                  let userResults =
                    entry.content?.itemContent?.user_results?.result;
                  let followerDetails = userResults?.legacy;
                  people.push({
                    userRestId: userResults?.rest_id,
                    userName: followerDetails?.screen_name,
                    following: followerDetails?.following,
                    followed_by: followerDetails?.followed_by,
                  });
                } else if (
                  entryType === "TimelineTimelineCursor" &&
                  entry?.content?.cursorType === "Bottom"
                ) {
                  next = entry?.content?.value;
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

  const addIdsToList = async (idsToAddToList) => {
    const reqUrl =
      "https://x.com/i/api/graphql/FpvDMFk4k8HXtkYjQGg_bw/ListAddMember";
    const body = {
      variables: {
        listId: helperData.createdListId,
        userId: "",
      },
      features: {
        rweb_tipjar_consumption_enabled: true,
        responsive_web_graphql_exclude_directive_enabled: true,
        verified_phone_label_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
        responsive_web_graphql_timeline_navigation_enabled: true,
      },
      queryId: "FpvDMFk4k8HXtkYjQGg_bw",
    };

    for (let i = 0; i < idsToAddToList.length; i++) {
      body.variables.userId = idsToAddToList[i];
      const response = await fetch(reqUrl, {
        method: "POST",
        headers: helperData.headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      // console.log("id data", i, data);
    }
  };

  const unfollowId = async (id) => {
    const reqUrl = "https://x.com/i/api/1.1/friendships/destroy.json";
    const headers = { ...helperData.headers };
    headers["content-type"] = "application/x-www-form-urlencoded";
    let body =
      "include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_is_blue_verified=1&include_ext_verified_type=1&include_ext_profile_image_shape=1&skip_status=1&user_id=";
    body = body + id;
    const response = await fetch(reqUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });
  };

  const main = async () => {
    helperData = await chrome.storage.sync.get([
      "headers",
      "userRestId",
      "createdListId",
    ]);
    await fetchFollowers(people, next);

    const idsToAddToList = [];
    for (let i = 0; i < people.length; i++) {
      if (!people[i].followed_by) {
        idsToAddToList.push(people[i].userRestId);
      }
    }

    await addIdsToList(idsToAddToList);
    console.log("added to list");

    for (let i = 0; i < idsToAddToList.length; i++) {
      await unfollowId(idsToAddToList[i]);
    }
  };

  main();
})();
