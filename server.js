// Libraries
var http = require('http'),
    fs = require('fs'),
    JSONStream = require('JSONStream'),
    pg = require('pg'),
    QueryStream = require('pg-query-stream'),
    url = require('url'),
    through = require('through'),
    Router = require('node-simple-router'),
    websocket = require('websocket-stream'),
    nodejswebsocket = require('nodejs-websocket');

// Variables
var connParam = process.env.PG_CONN,
    httpPort = process.argv[2],
    router = new Router({static_route: __dirname + '/static'}),
    filePath = "static/index.html",
    websocketStream;

// HTTP Server
var server = http.createServer(router);
server.listen(httpPort);

var wsserver = nodejswebsocket.createServer(function (connection) {
    connection.on("text", function (str) {
        if (str === "fetch") {

            var databaseQuery = "SELECT * FROM filtered_relations";
            var databaseQueryArray = [];

            pg.connect(connParam, function (err, client, done) {
                if (err) throw err;
                var query = new QueryStream(databaseQuery, databaseQueryArray);
                var stream = client.query(query);

                stream.pipe(through(function (buf) {
                    connection.sendText(JSON.stringify(buf));
                }, function () {
                    done();
                    connection.close();
                }));

            });
        }
    });
});
wsserver.listen(3007);
