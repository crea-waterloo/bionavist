var http = require('http'),	
	pg = require('pg'), 
	fs = require('fs'), 
	Router = require('node-simple-router');

var connParam = "postgres://creauser:crealogin@localhost/crearesearch";

// var port = process.argv[2];

// var router = new Router();

// router.get('/', function (request, response) {

// });

// router.get('/api/get_all_relations', function (request, response) {

// });

pg.connect(connParam, function(err, client, done) {
	if (err) {
		return console.error('error fetching client from pool', err);
	}
	client.query('SELECT * FROM filtered_relations;', [], function (err, result) {
		done();

		if (err) {
			return console.error('error running query', err);
		}
		result.rows.forEach(function (element, index, array) {
			console.log('subject: ' + element.subject + ', '
					  + 'object: ' + element.object + ', ' 
					  + 'predicate: ' + element.predicate + ', '
					  + 'keyword: ' + element.keyword);
		});
		client.end();
	});
});

// var server = http.createServer(function (request, response) {
// 	if (request.method != 'GET')
// 		return response.end('Error: Not a GET');


// });

// server.listen(port);