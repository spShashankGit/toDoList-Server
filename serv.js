var https = require('https');
var fs = require('fs');
var options = {
    host: "en.wikipedia.org",
    port: 443,
    path: "/wiki/Thomas_Jefferson",
    method: "GET"
};
var req = https.request(options, function (res) {
    var responseBody = "";
    console.log("Response from server started!");
    console.log(`Server Status : ${res.statusCode}`);
    console.log("Response Header %j", res.headers);

    res.setEncoding("UTF-8");

    res.once('data', function (chunk) {
        console.log(chunk);
    });

    res.on("data", function (chunks) {
        console.log(`--chunks-- ${chunks.length}`);
        responseBody += chunks;
    });

    res.on('end', function () {
        fs.writeFile("Thomas.html", responseBody, function (err) {
            if (err)
                throw err;

            console.log("Fiel Downloaded!")
        })
    })
});
req.on('error', function (err) {
    console.log(`problem with request :${err.message}`);
});
req.end();
