// Modified version of http://hublog.hubmed.org/archives/001927.html
// Added express, stats, favicon.ico route 
//

var crypto = require("crypto"), 
    db      = require("redis-url").connect( process.env.REDISTOGO_URL || undefined ),
    express = require('express'),
    port    = process.env.PORT || 8001;


// Create server
var app = express.createServer();

var get_date_string = function() {
    var date = new Date();
    return date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
};


app.get('/', function(req, res) {

    var date_string = get_date_string();
    var hash_data = (req.headers.referer) ? req.headers.referer : "unknown";
    var url_hash = crypto.createHash("md5").update(hash_data).digest("hex");

    var keys = [
        "by-url:" + url_hash,
        "by-day:" + date_string,
        "by-url-by-day:" + url_hash + ":" + date_string 
    ];

    for (key in keys) {
        console.log("Incrementing key: " + keys[key]);
        db.incr(keys[key]);
    }
    
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Counting.....");
    res.end();

});

// Sample stats - no error checking, ftl!
app.get('/stats/:year/:month/:day', function(req, res) {

    var year  = req.params.year;
    var month = req.params.month;
    var day   = req.params.day;

    db.get("by-day:" + year + "-" + month + "-" + day, function(err, red_res) {
        res.write(red_res || "No data for this day");
        res.end();
    });

});

app.listen(port);
console.log("Listening on <insert your favorite ip>:" + port);

