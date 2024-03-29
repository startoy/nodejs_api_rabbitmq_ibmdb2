/*
  Test sources if is valid or not when transpile with Babel
*/

import http from 'http';
import assert from 'assert';

import '../src/server.js';
import * as conf from '../src/config';

describe('=== Node Server ===', () => {
  it('should return 200', done => {
    let address = 'http://' + conf.rbHostname + ':' + conf.rbPort;
    let full = address + '/direct' + '/MessageSend';
    console.log(' -- Call api [%s]', full);
    http.get(full, res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
