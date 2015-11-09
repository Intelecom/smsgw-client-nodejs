## Build status ##

Travis: [![Build Status](https://travis-ci.org/Intelecom/smsgw-client-nodejs.svg?branch=travis)](https://travis-ci.org/Intelecom/smsgw-client-nodejs)

## npm module ##

```bash
npm install intelecom-smsgw-client
```

## Example usage ##

```javascript
// Initialize the client
var client = require('intelecom-smsgw-client').init(baseAddress, serviceId, username, password);

// Single recipient, 0 NOK
var messages = [{ recipient: '+47XXXXXXXX', content: 'This is a test' }];

client.send(messages,
	function (error) {
		console.log('Error:' + error);
	},
	function (response) {
		console.log('Response:' + JSON.stringify(response));
	});
```

## Install dependencies ##

```bash
npm install
```

## Run tests ##

```bash
npm test
```