
/*
 * GET home page.
 */

var request = require('request');
var querystring = require('querystring');

exports.index = function(req, res) {
	res.render('index', { title: 'SoundCloud Ripper' });
};

exports.download = function(req, res) {
	var qs = querystring.stringify({
		url: req.param('url'),
		client_id: process.env.SOUNDCLOUD_CLIENT_ID
	});
	var resolve = 'http://api.soundcloud.com/resolve.json?' + qs;

	request(resolve, function(error, response, body) {
		var track = JSON.parse(body);
		var downloadUrl = track.download_url || track.stream_url;
		var qs = querystring.stringify({
			client_id: process.env.SOUNDCLOUD_CLIENT_ID
		});

		if (!downloadUrl) {
			res.redirect('/');
			return;
		}

		res.set({
			'Content-Type': 'audio/mp3',
			'Content-Disposition': 'attachment; filename="' + track.title + '.mp3"'
		});

		setTimeout(function() {
			request.get(downloadUrl + '?' + qs).pipe(res);
		}, 10 * 1000);
	});
};

exports.notFound = function(req,res) {
	res.render('404', { title: 'SoundCloud Ripper' });
};
