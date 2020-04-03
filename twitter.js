const secrets = require("./secrets.json");
const https = require("https");

module.exports.getToken = function() {
    return new Promise((resolve, reject) => {
        let creds = `${secrets.Key}:${secrets.Secret}`;
        let encodedCreds = Buffer.from(creds).toString("base64");

        const options = {
            host: "api.twitter.com",
            path: "/oauth2/token",
            method: "POST",
            headers: {
                Authorization: `Basic ${encodedCreds}`,
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            }
        };

        const cb = function(response) {
            if (response.statusCode !== 200) {
                reject(response.statusCode);
            }

            let body = "";
            response.on("data", function(chunk) {
                body += chunk;
            });

            response.on("end", function() {
                let parsedBody = JSON.parse(body);
                resolve(parsedBody.access_token);
            });
        };

        const req = https.request(options, cb);
        req.end("grant_type=client_credentials");
    });
};

module.exports.getTweets = function(bearerToken, screenName) {
    return new Promise((resolve, reject) => {
        const options = {
            method: "GET",
            host: "api.twitter.com",
            // host: "https://api.twitter.com/1.1/statuses/user_timeline.json",
            path: `/1.1/statuses/user_timeline.json?screen_name=${screenName}&tweet_mode=extended`,
            headers: {
                Authorization: "Bearer " + bearerToken
            }
        };

        const cb = function(response) {
            if (response.statusCode != 200) {
                reject(response.statusCode);
            }

            let body = "";
            response.on("data", function(chunk) {
                body += chunk;
            });

            response.on("end", function() {
                let parsedBody = JSON.parse(body);
                resolve(parsedBody);
            });
        };
        const req = https.request(options, cb);
        req.end();
    });
};
//
module.exports.filterTweets = function(tweets) {
    let newsArr = [];

    let filterdTweets = tweets.filter(
        x => x.entities.urls.length === 1 && x.full_text.length >= 1
    );
    filterdTweets.forEach(x => {
        let obj = {};
        // console.log("these are the screen names: ", x.user.screen_name);
        const fullText = x.full_text.split("https");
        obj["title"] = fullText[0] + " (" + x.user.name + ")";
        obj["url"] = x.entities.urls[0].url;
        // obj["source"] = x.user.name;

        newsArr.push(obj);
    });
    return newsArr;
};
