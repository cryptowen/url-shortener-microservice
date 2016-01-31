require('dotenv').config();
var express = require("express");
var nunjucks = require("nunjucks");
var app = express();

var urls = [];

function urlIsValid(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( url );
}

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
  res.render('index.html', {app_url: process.env.APP_URL});
});

app.get('/new/*', function(req, res) {
    // console.log(req.params);
    var url = req.params[0];
    if (!urlIsValid(url) && req.query.allow !== 'true') {
        res.json({ "error": "URL invalid" });
    }
    var url_id = urls.indexOf(url);
    if (url_id === -1) {
        urls.push(url);
        url_id = urls.length - 1;
    }
    res.json({
        original_url: url,
        short_url: process.env.APP_URL+'/'+url_id
    });
});

app.get('/:id', function(req, res) {
    var url = urls[req.params.id];
    if (url === undefined) {
        res.json({
            "error": "No short url found for given input"
        });
    } else {
        res.redirect(url);
    }
});

app.listen(process.env.PORT, function(){
  console.log('Server start, listen on ' + process.env
  .IP + ':' + process.env.PORT);
});
