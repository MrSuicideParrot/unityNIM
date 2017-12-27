var fs = require('fs');

var util = require(__dirname + '/myExpress.js');

var pathDB = __dirname + "/rankings.json";

var rankingsDB = {};

function rankings(body, response) {
    try {
        body = JSON.parse(body);
    } catch (err) {
        response.writeHead(400);
        response.end(JSON.stringify({ "error": "Request body is malformed" }));
        return;
    }
    if (!('size' in body) || parseInt(body['size']) < 3) {
        response.writeHead(400);
        response.end(JSON.stringify({ "error": "Size is undefined" }));
        return;
    }

    response.writeHead(200);
    response.end(JSON.stringify(rankingsDB[body['size']]));
}

function rankupdate(winner, loser, size) {
    addwin(winner, size);
    adddef(loser, size);
    saverankings(size);
}

function addwin(winner, size) {
    if (rankingsDB[size]) {
        for (i in rankingsDB[size]['ranking']) {
            if (rankingsDB[size]['ranking'][i]['nick'] == winner) {
                rankingsDB[size]['ranking'][i]['victories']++;
                rankingsDB[size]['ranking'][i]['games']++;
                return;
            }
        }
        rankingsDB[size]['ranking'].push({ nick: winner, victories: 1, games: 1 });
    }
    else {
        rankingsDB[size] = { 'ranking': [{ nick: winner, victories: 1, games: 1 }] };
    }
}

function adddef(loser, size) {
    if (rankingsDB[size]) {
        for (i in rankingsDB[size]['ranking']) {
            if (rankingsDB[size]['ranking'][i]['nick'] == loser) {
                rankingsDB[size]['ranking'][i]['games']++;
                return;
            }
        }
        rankingsDB[size]['ranking'].push({ nick: loser, victories: 0, games: 1 });
    }
    else {
        rankingsDB[size] = { 'ranking': [{ nick: loser, victories: 0, games: 1 }] };
    }
}

function loadrankings() {
    fs.readFile(pathDB, function (err, data) {
        if (err) {
            if (err.code === "ENOENT") {
                fs.writeFile(pathDB, '', function (err) {
                    if (err) throw err;
                });
            }
            return;
        }
        try {
            rankingsDB = JSON.parse(data.toString());
        } catch (err) {
            rankingsDB = {};
        }
    });
}

function saverankings(size) {
    rankingsDB[size]['ranking'].sort(function (a, b) {
        return parseInt(b.victories) - parseInt(a.victories);
    });
    fs.writeFile(pathDB, JSON.stringify(rankingsDB), function (err) {
        if (err) throw err;
    });
}

module.exports.rankings = rankings;
module.exports.loadrankings = loadrankings;
module.exports.saverankings = saverankings;
module.exports.rankupdate = rankupdate;