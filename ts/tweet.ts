class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        // Identify completed events
        if (this.text.startsWith("Just completed") ||
            this.text.startsWith("Just posted") ||
            this.text.startsWith("I just completed")) {
            return "completed_event";
        }

        // Identify live events
        if (this.text.startsWith("Watch my")) {
            return "live_event";
        }

        // Identify achievements
        if (this.text.startsWith("Achieved a new") ||
            this.text.startsWith("I just set")) {
            return "achievement";
        }

        // All other tweets
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        let dashIndex = this.text.indexOf(" - ");

        if (dashIndex === -1) {
            return "";
        }

        // Get everything after the dash
        let comment = this.text.substring(dashIndex + 3);

        // Remove the tweet link
        comment = comment.replace(/https?:\/\/\S+/g, "");

        // Remove the RunKeeper hashtag
        comment = comment.replace(/#Runkeeper/gi, "");

        // Remove common automatically generated text
        comment = comment.replace(/TomTom MySports Watch/gi, "");

        return comment.trim();
    }

    get activityType():string {
    if (this.source != 'completed_event') {
        return "unknown";
    }

    // Split the tweet into words
    let words = this.text.split(" ");

    // Look for the distance unit
    for (let i = 0; i < words.length; i++) {
        if (words[i].toLowerCase() === "km" ||
            words[i].toLowerCase() === "mi") {

            return words[i + 1].toLowerCase();
        }
    }

    get distance():number {
    if (this.source != 'completed_event') {
        return 0;
    }

    // Split the tweet into words
    let words = this.text.split(" ");

    // Look for the distance unit
    for (let i = 0; i < words.length; i++) {
        let unit = words[i].toLowerCase();

        if (unit === "km" || unit === "mi") {
            let distance = parseFloat(words[i - 1]);

            // Check if the distance is a valid number
            if (isNaN(distance)) {
                return 0;
            }

            // Convert kilometers to miles
            if (unit === "km") {
                distance = distance / 1.609;
            }

            return distance;
        }
    }

    return 0;
}

    getHTMLTableRow(rowNumber:number):string {
    //I used ChatGPT to help me on this one

    // Find the link in the tweet
    let words = this.text.split(" ");
    let link = "";

    for (let word of words) {
        if (word.startsWith("https://") || word.startsWith("http://")) {
            link = word;
            break;
        }
    }

    // Display the entire original tweet
    let tweetText = this.text;

    // Escape special HTML characters
    tweetText = tweetText.replace(/&/g, "&amp;");
    tweetText = tweetText.replace(/</g, "&lt;");
    tweetText = tweetText.replace(/>/g, "&gt;");
    tweetText = tweetText.replace(/"/g, "&quot;");
    tweetText = tweetText.replace(/'/g, "&#39;");

    let row = "<tr>";
    row += "<td>" + rowNumber + "</td>";
    row += "<td>" + this.activityType + "</td>";

    if (link !== "") {
        row += '<td><a href="' + link + '" target="_blank" rel="noopener noreferrer">';
        row += tweetText;
        row += "</a></td>";
    } else {
        row += "<td>" + tweetText + "</td>";
    }

    row += "</tr>";

    return row;
}
}
