function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
    // Count each completed activity type
    let activityCounts = {};

    for (let tweet of tweet_array) {
        if (tweet.source === "completed_event") {
            let activity = tweet.activityType;

            if (activity !== "unknown" && activity !== "") {
                if (activityCounts[activity] === undefined) {
                    activityCounts[activity] = 0;
                }

                activityCounts[activity]++;
            }
        }
    }

    // Sort activities from most common to least common
    let sortedActivities = Object.entries(activityCounts);

    sortedActivities.sort(function(a, b) {
        return b[1] - a[1];
    });

    // Print the results automatically
    console.table(sortedActivities);

    // Update the webpage
    document.getElementById("numberActivities").innerText =
        sortedActivities.length;

    document.getElementById("firstMost").innerText =
        sortedActivities[0][0];

    document.getElementById("secondMost").innerText =
        sortedActivities[1][0];

    document.getElementById("thirdMost").innerText =
        sortedActivities[2][0];

	let graphData = sortedActivities.map(function(activity) {
        return {
            activityType: activity[0],
            count: activity[1]
        };
    });

    // Graph showing the number of tweets for each activity
    activity_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A graph of the number of Tweets containing each type of activity.",
        "data": {
            "values": graphData
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "activityType",
                "type": "nominal",
                "sort": "-y",
                "title": "Activity Type"
            },
            "y": {
                "field": "count",
                "type": "quantitative",
                "title": "Number of Tweets"
            }
        }
    };

    vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
