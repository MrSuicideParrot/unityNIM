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
    response.end(JSON.stringify(rankingsDB));
}

function rankupdate(winner, loser) {
    addwin(winner);
    adddef(loser);
    saverankings();
}

function addwin(winner) {
    for (i in rankingsDB['ranking']) {
        if (rankingsDB['ranking'][i]['nick'] == winner) {
            rankingsDB['ranking'][i]['victories']++;
            rankingsDB['ranking'][i]['games']++;
            return;
        }
    }
    rankingsDB['ranking'].push({ nick: winner, victories: 1, games: 1 });
}

function adddef(loser) {
    for (i in rankingsDB['ranking']) {
        if (rankingsDB['ranking'][i]['nick'] == loser) {
            rankingsDB['ranking'][i]['games']++;
            return;
        }
    }
    rankingsDB['ranking'].push({ nick: winner, victories: 0, games: 1 });
}

function loadrankings() {
    fs.readFile(pathDB, function (err, data) {
        if (err){
            if(err.code === "ENOENT"){
                 fs.writeFile(pathDB, JSON.stringify({}), function (err) {
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

function saverankings() {
    rankingsDB['rankings'].sort(function (a, b) {
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