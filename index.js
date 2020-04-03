const express = require("express");
const app = express();
// const promises = require("./twitter.js").promises;
const { getToken, getTweets, filterTweets } = require("./twitter.js");
// const fs = require('fs').promises;

app.use(express.static("./ticker"));

app.get("/data.json", (req, res) => {
    getToken()
        .then(token => {
            return (
                Promise.all([
                    getTweets(token, "theonion"),
                    getTweets(token, "nytimes"),
                    getTweets(token, "forbes")
                ])
                    // getTweets(token)
                    .then(results => {
                        // console.log(results);
                        let bbcworld = results[0];
                        let nytimes = results[1];
                        let forbes = results[2];
                        //#1 concat
                        // let mergedResults = bbcworld.concat(nytimes, forbes);
                        //#2 spread operator
                        let mergedResults = [
                            ...bbcworld,
                            ...nytimes,
                            ...forbes
                        ];

                        let sorted = mergedResults.sort((a, b) => {
                            return (
                                new Date(b.created_at) - new Date(a.created_at)
                            );
                        });

                        const filteredTweets = filterTweets(sorted);
                        // const filteredTweets = filterTweets(results);
                        res.json(filteredTweets);
                    })
                    .catch(err => console.log("err in gettweets: ", err))
            );
        })
        .catch(err => console.log("err in getToken: ", err));
});

app.listen(8080, () => console.log("TWITTER ticker up and running"));
