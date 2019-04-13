require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var moment = require("moment");

var Spotify = require('node-spotify-api');

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var word = "";
var randomAction = "";
var randomWord = "";

fs.readFile("random.txt", "utf8", function(err,data){
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    else{
        dataArr = data.split(",");
        randomAction = dataArr[0];
        randomWord = dataArr[1];
        
        function search(){
            if (action === "movie-this") {
                if (process.argv[3]) {
                    word = process.argv[3];
                } else {
                    word = "Mr. Nobody";
                }
                movie();
            }
            
            if (action === "concert-this") {
                word = process.argv[3];
                band();
            }
            
            if (action === "spotify-this") {
                if(process.argv[3]){
                    word = process.argv[3];
                }
                else if(word != randomWord){
                    word = "The Sign artist:'Ace of Base'";
                }
                music();
            }
        }
        
        if(process.argv[2] === "do-what-it-says"){
            word = randomWord;
            action = randomAction;
            search();
        }
        
        search();
    }
})









function movie() {
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + word).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        }
    )
}

function band() {
    axios.get("https://rest.bandsintown.com/artists/" + word + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("\n");
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
            }
        }
    )
}

function music() {
    spotify.search({ type: 'track', query: word }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0]);
        console.log("Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
    });
}