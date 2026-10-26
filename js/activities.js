function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

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

    // Update the webpage
    document.getElementById("numberActivities").innerText =
        sortedActivities.length;

    document.getElementById("firstMost").innerText =
        sortedActivities[0][0];

    document.getElementById("secondMost").innerText =
        sortedActivities[1][0];

    document.getElementById("thirdMost").innerText =
        sortedActivities[2][0];

    // Get the three most common activity types
    let topThree = [
        sortedActivities[0][0],
        sortedActivities[1][0],
        sortedActivities[2][0]
    ];

    // Calculate average distance for each activity
    let averageDistances = [];

    for (let activity of topThree) {
        let totalDistance = 0;
        let count = 0;

        for (let tweet of tweet_array) {
            if (tweet.source === "completed_event" &&
                tweet.activityType === activity &&
                tweet.distance > 0) {

                totalDistance += tweet.distance;
                count++;
            }
        }

        averageDistances.push({
            activity: activity,
            average: count > 0 ? totalDistance / count : 0
        });
    }

    // Sort by average distance, longest first
    averageDistances.sort(function(a, b) {
        return b.average - a.average;
    });

    // Display longest and shortest average activities
    document.getElementById('longestActivityType').innerText =
        averageDistances[0].activity;

    document.getElementById('shortestActivityType').innerText =
        averageDistances[averageDistances.length - 1].activity;

    // Compare weekday and weekend distances
    let weekdayTotal = 0;
    let weekdayCount = 0;
    let weekendTotal = 0;
    let weekendCount = 0;

    for (let tweet of tweet_array) {
        if (tweet.source === "completed_event" &&
            topThree.includes(tweet.activityType) &&
            tweet.distance > 0) {

            let day = tweet.time.getUTCDay();

            if (day === 0 || day === 6) {
                weekendTotal += tweet.distance;
                weekendCount++;
            } else {
                weekdayTotal += tweet.distance;
                weekdayCount++;
            }
        }
    }

    let weekdayAverage = weekdayCount > 0
        ? weekdayTotal / weekdayCount : 0;

    let weekendAverage = weekendCount > 0
        ? weekendTotal / weekendCount : 0;

    // Display whether weekdays or weekends have longer activities
    if (weekendAverage > weekdayAverage) {
        document.getElementById('weekdayOrWeekendLonger').innerText =
            "weekends";
    } else {
        document.getElementById('weekdayOrWeekendLonger').innerText =
            "weekdays";
    }

    // Prepare data for the activity count graph
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

    // Prepare data for distance visualizations
    let distanceData = [];

    let days = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    for (let tweet of tweet_array) {
        if (tweet.source === "completed_event" &&
            topThree.includes(tweet.activityType) &&
            tweet.distance > 0) {

            distanceData.push({
                activityType: tweet.activityType,
                distance: tweet.distance,
                day: days[tweet.time.getUTCDay()]
            });
        }
    }

    // Graph showing individual activity distances
    let individualSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "values": distanceData
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "day",
                "type": "ordinal",
                "sort": days,
                "title": "time (day)"
            },
            "y": {
                "field": "distance",
                "type": "quantitative",
                "title": "distance"
            },
            "color": {
                "field": "activityType",
                "type": "nominal",
                "title": "Activity Type"
            }
        }
    };

    // Graph showing average activity distances
    let aggregateSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "values": distanceData
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "day",
                "type": "ordinal",
                "sort": days,
                "title": "time (day)"
            },
            "y": {
                "field": "distance",
                "type": "quantitative",
                "aggregate": "mean",
                "title": "Mean of distance"
            },
            "color": {
                "field": "activityType",
                "type": "nominal",
                "title": "Activity Type"
            }
        }
    };

    // Display individual distances first
    let showingAggregate = false;

    vegaEmbed('#distanceVis', individualSpec, {actions:false});

    // Switch between individual and average distances
    let aggregateButton = document.getElementById('aggregate');

    aggregateButton.addEventListener('click', function() {
        showingAggregate = !showingAggregate;

        if (showingAggregate) {
            vegaEmbed('#distanceVis', aggregateSpec, {actions:false});
            aggregateButton.innerText = "Show all activities";
        } else {
            vegaEmbed('#distanceVis', individualSpec, {actions:false});
            aggregateButton.innerText = "Show means";
        }
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});
