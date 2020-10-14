/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var messages = require('./generated/api/helloworld_pb')
var services = require('./generated/api/helloworld_grpc_pb')

var grpc = require('grpc')
var async = require('async')

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  var reply = new messages.HelloReply()
  reply.setMessage('Hello ' + call.request.getName())
  callback(null, reply)
}

/**
 * @param {!Object} call
 */
function doSayRepeatHello(call) {
  var senders = []
  function sender(name) {
    return (callback) => {
      call.write({
        message: 'Hey! ' + name,
      })
      _.delay(callback, 500) // in ms
    }
  }
  for (var i = 0; i < call.request.count; i++) {
    senders[i] = sender(call.request.name + i)
  }
  async.series(senders, () => {
    call.end()
  })
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server()
  server.addService(services.GreeterService, {
    sayHello: sayHello,
    sayRepeatHello: doSayRepeatHello,
  })
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('GRPC test server running!')
}

main()
