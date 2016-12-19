	// Node module imports needed to run the functions
	var fs = require("fs"); //reads and writes files
	var request = require("request");
	var keys = require("./keys.js");
	var twitter = require("twitter");
	var spotify = require ("spotify");
	var liriArgument = process.argv[2];
// ---------------------------------------------------------------------------------------------------------------
	// Possible commands for this liri app
	switch(liriArgument) {
		case "my-tweets": myTweets(); break;
		case "spotify-this-song": spotifyThisSong(); break;
		case "movie-this": movieThis(); break;
		case "do-what-it-says": doWhatItSays(); break;
		// Instructions displayed in terminal to the user
		default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
			"1. my-tweets 'any twitter name' " +"\r\n"+
			"2. spotify-this-song 'any song name' "+"\r\n"+
			"3. movie-this 'any movie name' "+"\r\n"+
			"4. do-what-it-says."+"\r\n"+
			"Be sure to put the movie or song name in quotation marks if it's more than one word.");
	};
// ---------------------------------------------------------------------------------------------------------------
// Functions
	// Movie function, uses the Request module to call the OMDB api
	function movieThis(){
		var movie = process.argv[3];

		if (process.argv[3] == "") {
			movie = "Mr. Nobody";
		}
		
		var params = movie;
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
		
		var movieObject = JSON.parse(body);
        console.log("the title is ", movieObject.Title);
        console.log("the year is ", movieObject.Year);
        console.log("the IMDB Rating is ", movieObject.imdbRating);
        console.log("the country is ", movieObject.Country);
        console.log("the language is ", movieObject.Language);
        console.log("the plot is ", movieObject.Plot);
        console.log("the actors are ", movieObject.Actors);
			
		});
	};
	// Tweet function, uses the Twitter module to call the Twitter api
	function myTweets() {
		var client = new twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret, 
		});
		var twitterUsername = process.argv[3];
	
		client.get("statuses/user_timeline/", twitterUsername, function(error, data, response){
			if (!error) {
				for(var i = 0; i < data.length; i++) {
					//console.log(response); // Show the full response in the terminal
					var twitterResults = 
					"@" + data[i].user.screen_name + ": " + 
					data[i].text + "\r\n" + 
					data[i].created_at + "\r\n" + 
					"------------------------------ " + i + " ------------------------------" + "\r\n";
					console.log(twitterResults);
					log(twitterResults); // calling log function
				}
			}  else {
				console.log("Error :"+ error);
				return;
			}
		});
	}
	// Spotify function, uses the Spotify module to call the Spotify api
	function spotifyThisSong() {
		var songName = process.argv[3];

		spotify.search({type: 'track', query: songName}, function(err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return; //from spotify npm docs
        } else {
            var songInfo = data.tracks.items[0];
            console.log("the artist is", songInfo.artists[0].name);
            console.log("the song name is", songInfo.name);
            console.log("the album is called", songInfo.album.name);
            console.log("here is a preview link", songInfo.preview_url);

        };

		});
	};
	// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
	// Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}