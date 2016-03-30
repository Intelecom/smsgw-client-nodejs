'use strict';

var https = require('https');
var url = require('url');

function smsGatewayClient(baseAddress, serviceId, username, password) {
	var parsedBaseAddress = url.parse(baseAddress);
	var options = {
		hostname: parsedBaseAddress.hostname,
		port: 443,
		path: parsedBaseAddress.path + '/sendMessages',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	};

	function send(messages, errorCallback, successCallback) {
		var request = {
			serviceId: serviceId,
			username: username,
			password: password,
			message: messages
		};

		var requestJson = JSON.stringify(request);
		options.headers['Content-Length'] = Buffer.byteLength(requestJson, 'utf8');
		var responseJson = "";

		https.request(options, function (response) {
			response.setEncoding('utf8');
			response.on('data', function (data) {
				responseJson += data;
			});
			response.on('end', function () {
				try {
					var gatewayResponse = JSON.parse(responseJson);
					successCallback(gatewayResponse);
				} catch (error) {
					errorCallback(error);
				}
			});
		}).on('error', function (error) {
			errorCallback(error);
		}).end(requestJson);
	};

	return {
		send: send
	};
}

exports.init = smsGatewayClient;