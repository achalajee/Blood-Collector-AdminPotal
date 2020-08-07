const express = require("express");
// const path = require("path");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
// Routes
const routes = require("./routes/index");

//Express
let app = express();
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
});

// set the view engine to ejs
app.set("view engine", "ejs");

// Convert the request in to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set routes
app.use("/", routes);

exports.app = functions.https.onRequest(app);
