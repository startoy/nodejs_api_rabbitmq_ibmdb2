/*
  Test sources if is valid or not when transpile with Babel
*/

import http from 'http'
import assert from 'assert'

import '../src/server.js'

describe('=== Node Server ===', ()=>{
  it('should return 200', done => {
    http.get('http://127.0.0.1:8080', res => {
      assert.equal(200, res.statusCode)
      done()
    })
  })
})