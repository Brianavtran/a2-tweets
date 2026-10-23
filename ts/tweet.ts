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
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
