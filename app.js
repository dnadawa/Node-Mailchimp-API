const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/a9fb39274e";

    const options = {
        method: "POST",
        auth: "Dulaj:1737718c93d9a6b56a26e877180e7ee8-us17"
    }

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            const statusCode = response.statusCode;
            if (statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
            console.log(JSON.parse(data).errors);
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, () => console.log('Server is running on port 3000.'));
