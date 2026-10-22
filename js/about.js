function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if(runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
    //It works correctly, your task is to update the text of the other tags in the HTML file!
    document.getElementById('numberTweets').innerText = tweet_array.length;

    // Find the earliest and latest tweet dates
    let earliestDate = tweet_array[0].time;
    let latestDate = tweet_array[0].time;

    for (let tweet of tweet_array) {
        if (tweet.time < earliestDate) {
            earliestDate = tweet.time;
        }

        if (tweet.time > latestDate) {
            latestDate = tweet.time;
        }
    }

    // Format the dates
    let dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    };

    let firstDate = earliestDate.toLocaleDateString('en-US', dateOptions);
    let lastDate = latestDate.toLocaleDateString('en-US', dateOptions);

    // Update the HTML with the earliest and latest dates
    document.getElementById('firstDate').innerText = firstDate;
    document.getElementById('lastDate').innerText = lastDate;
    // Count the tweets in each category
    let completedCount = 0;
    let liveCount = 0;
    let achievementCount = 0;
    let miscellaneousCount = 0;

    for (let tweet of tweet_array) {
        if (tweet.source === "completed_event") {
            completedCount++;
        } else if (tweet.source === "live_event") {
            liveCount++;
        } else if (tweet.source === "achievement") {
            achievementCount++;
        } else {
            miscellaneousCount++;
        }
    }

    // Calculate the percentage of each category
    let totalTweets = tweet_array.length;

    let completedPercent = (completedCount / totalTweets * 100).toFixed(2);
    let livePercent = (liveCount / totalTweets * 100).toFixed(2);
    let achievementPercent = (achievementCount / totalTweets * 100).toFixed(2);
    let miscellaneousPercent = (miscellaneousCount / totalTweets * 100).toFixed(2);

    // Display the number of tweets in each category
    document.querySelectorAll('.completedEvents').forEach(function(element) {
        element.innerText = completedCount;
    });

    document.querySelector('.liveEvents').innerText = liveCount;
    document.querySelector('.achievements').innerText = achievementCount;
    document.querySelector('.miscellaneous').innerText = miscellaneousCount;

    // Display the percentages
    document.querySelector('.completedEventsPct').innerText = completedPercent + '%';
    document.querySelector('.liveEventsPct').innerText = livePercent + '%';
    document.querySelector('.achievementsPct').innerText = achievementPercent + '%';
    document.querySelector('.miscellaneousPct').innerText = miscellaneousPercent + '%';

    // Print the counts to the console for testing
    console.log("Completed:", completedCount);
    console.log("Live:", liveCount);
    console.log("Achievements:", achievementCount);
    console.log("Miscellaneous:", miscellaneousCount);

    console.log("Total:", completedCount + liveCount + achievementCount + miscellaneousCount);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});
