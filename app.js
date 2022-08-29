const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");
const { response } = require("express");

const app = express();

app.use(express.static("public")); //static files
app.use(bodyParser.urlencoded({ extended: true }));

//get request
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us12.api.mailchimp.com/3.0/lists/6edc6c5e4c";
  const Options = {
    method: "POST",
    auth: "om:0403cd63e19109c64a351770e367c96b-us12",
  };
  const request = https.request(url, Options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("server is active on localhost:3000");
});
//0403cd63e19109c64a351770e367c96b-us12
//list id  6edc6c5e4c
