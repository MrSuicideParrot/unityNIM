var fs = require('fs');

var util = require('./myExpress.js');

var pathDB = "rankings.json";

var rankingsDB = {};

function rankings(body, response) {
    try {
        body = JSON.parse(body);
    } catch (err) {
        response.writeHead(400);
        response.end(JSON.stringify({ "error": "Request body is malformed" }));
        return;
    }
    if (!('size' in body) || body['size'] !== parseInt(body['size']) || body['size'] < 3) {
        response.writeHead(400);
        response.end(JSON.stringify({ "error": "Size is undefined" }));
        return;
    }

    response.writeHead(200);
    response.end(JSON.stringify(rankingsDB));
}

function loadrankings() {
    fs.readFile(pathDB, function (err, data) {
        if (err) throw err;
        rankingsDB = JSON.parse(data.toString());
    });
}

module.exports.rankings = rankings;
module.exports.loadrankings = loadrankings;