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
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    loadSavedRunkeeperTweets().then(parseTweets);
});
