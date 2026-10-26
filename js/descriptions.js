let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    // Filter to just the written tweets
    let tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    writtenTweets = [];

    for (let tweet of tweet_array) {
        if (tweet.written) {
            writtenTweets.push(tweet);
        }
    }

    // Display the initial results
    updateSearchResults();
}

function updateSearchResults() {
    let searchText = document.getElementById('textFilter').value;
    let searchLower = searchText.toLowerCase();

    let matchingTweets = [];

    // Search the user-written text
    for (let tweet of writtenTweets) {
        if (tweet.writtenText.toLowerCase().includes(searchLower)) {
            matchingTweets.push(tweet);
        }
    }

    // Update the result count and search text
    document.getElementById('searchCount').innerText =
        matchingTweets.length;

    document.getElementById('searchText').innerText = searchText;

    // Clear the previous results
    let table = document.getElementById('tweetTable');
    table.innerHTML = "";

    // Add each matching tweet to the table
    for (let i = 0; i < matchingTweets.length; i++) {
        table.innerHTML += matchingTweets[i].getHTMLTableRow(i + 1);
    }
}

function addEventHandlerForSearch() {
    // Search the written tweets as text is entered into the search box
    document.getElementById('textFilter').addEventListener('input', function() {
        updateSearchResults();
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
    addEventHandlerForSearch();
    loadSavedRunkeeperTweets().then(parseTweets);
});
