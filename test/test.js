'use strict';

var assert = require('assert');
var nock = require('nock');
nock.disableNetConnect();
var client = require('../lib/index').init('https://www.dummy-address.com/foo', 0, '', '');
var uri = 'https://www.dummy-address.com/foo';
var path = '/sendMessages';
var dummyGwRequest = { serviceId: 0, username: "", password: "", message: [] };
var dummyGwResponse = {
  messageStatus: [{
    statusCode: 1,
    statusMessage: 'Message enqueued for sending',
    clientReference: null,
    recipient: '+4712345678',
    messageId: '1234567890az',
    sessionId: null,
    sequenceIndex: 1
  }]
};

describe('SmsGatewayClient', function () {

  describe('when GW returns 200', function () {
    it('should pass data to success callback', function (done) {
      var scope = nock(uri)
        .post(path, dummyGwRequest)
        .reply(200, dummyGwResponse);

      var expected = {
        messageStatus: [{
          statusCode: 1,
          statusMessage: 'Message enqueued for sending',
          clientReference: null,
          recipient: '+4712345678',
          messageId: '1234567890az',
          sessionId: null,
          sequenceIndex: 1
        }]
      };

      client.send([],
        function () {
          assert.fail();
        },
        function (actual) {
          assert.deepEqual(actual, expected);
          scope.done();
          done();
        });
    });
  });

  describe('when GW returns 500', function () {
    it('should call error callback', function (done) {
      var scope = nock(uri)
        .post(path, dummyGwRequest)
        .reply(500);

      client.send([],
        function () {
          scope.done();
          done();
        },
        function () {
          assert.fail();
        });
    });
  });

  describe('when sending message(s)', function () {
      it('should calculate the correct content length', function (done) {
          var dummyGwRequestWithContent = dummyGwRequest;
          var content = 'This is a test with æ, ø and å';
          dummyGwRequestWithContent.message = [{ content: content }];
          var scope = nock(uri)
            .matchHeader('Content-Length', 103)
            .post(path, dummyGwRequestWithContent)
            .reply(200, dummyGwResponse);

          client.send([{ content: content }],
            function () {
              assert.fail();
            },
            function () {
              scope.done();
              done();
            });
      });
  });

});