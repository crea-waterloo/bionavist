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

// router.get('/api/get_all_relations', function (request, response) {

//     // Parsing URL
//     var parsedRequest = url.parse(request.url, true),
//         keyword = parsedRequest.query.keyword,
//         databaseQuery,
//         databaseQueryArray;

//     // Building Query
//     if (keyword == null) {
//         databaseQuery = "SELECT * FROM filtered_relations";
//         databaseQueryArray = [];
//     } else {
//         databaseQuery = "SELECT * FROM filtered_relations";
//         databaseQueryArray = [];
//         // Currently the keyword is only an integer.. This isn't gonna work :(
//         // databaseQuery = "SELECT * FROM filtered_relations WHERE keyword='$1'::VARCHAR";
//         // databaseQueryArray = [keyword];
//     }

//     // fetchFromPostgres(databaseQuery, databaseQueryArray, ...);

// });

// HTTP Server
var server = http.createServer(router);
server.listen(httpPort);


// function fetchFromPostgres(outstream) {
//     var databaseQuery = "SELECT * FROM filtered_relations";
//     var databaseQueryArray = [];

//     pg.connect(connParam, function (err, client, done) {

//         if (err) {
//             return console.error('error fetching client from pool', err);
//         }

//         var query = new QueryStream(databaseQuery, databaseQueryArray);
//         var stream = client.query(query);
//         stream.on('end', done);
//         stream.pipe(through(function (buf) {
//             // console.log(JSON.stringify(buf));
//             this.queue(JSON.stringify(buf));
//         }, function () {
//             this.queue(null);
//         })).pipe(outstream);

//     });
// }

// fetchFromPostgres(process.stdout);


// // Websocket Server
// var someOtherServer = http.createServer();
// websocket.createServer({server: someOtherServer}, fetchFromPostgres);
// someOtherServer.listen(8081);

var wsserver = nodejswebsocket.createServer(function (connection) {
    connection.on("text", function (str) {
        if (str === "fetch") {

            var databaseQuery = "SELECT * FROM filtered_relations";
            var databaseQueryArray = [];

            pg.connect(connParam, function (err, client, done) {
                if (err) throw err;
                var query = new QueryStream(databaseQuery, databaseQueryArray);
                var stream = client.query(query);

                // stream.on("readable", function () {
                //     var buf = stream.read();
                //     console.log(JSON.stringify(buf));
                //     connection.sendText(JSON.stringify(buf));
                // });
                // stream.on("end", done);


                stream.pipe(through(function (buf) {
                    //console.log(JSON.stringify(buf));
                    connection.sendText(JSON.stringify(buf));
                }, function () {
                    done();
                    connection.close();
                }));

            });
        }
    });
});
wsserver.listen(8081);
