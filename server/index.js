"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of tweets. It's a basic object with an array in it.
const db = require("./lib/in-memory-db");

const DataHelpers = require("./lib/data-helpers.js")(db);

// Update the dates for the initial tweets (data-files/initial-tweets.json).
require("./lib/date-adjust")();

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object, so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);

app.listen(PORT, () => {
});
