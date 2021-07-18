const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//api-key = d4fb0c5acea698533e72b9ffdd09a9ff-us6
//lebel-key = 24d805bc94
app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const url = "https://us6.api.mailchimp.com/3.0/lists/24d805bc94";
  const data = {
    list_id: "24d805bc94",
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  app.post("/failure", function (req, res) {
    res.redirect("/");
  });
  const options = {
    method: "POST",
    auth: "rnriyan:d4fb0c5acea698533e72b9ffdd09a9ff-us6",
  };
  const jsonData = JSON.stringify(data);
  const request = https.request(url, options, function (response) {
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

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at 3000 PORT");
});
