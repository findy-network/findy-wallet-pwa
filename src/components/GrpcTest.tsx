import React from 'react'

/*const {
  HelloRequest,
  HelloReply,
} = require('../generated/api/helloworld_pb.js')
const { GreeterClient } = require('../generated/api/helloworld_grpc_web_pb')*/

import { GreeterClient } from '../generated/api/HelloworldServiceClientPb'
import { HelloRequest } from '../generated/api/helloworld_pb'

function GrpcTest() {
  return (
    <div>
      <button
        onClick={() => {
          var client = new GreeterClient('http://localhost:8080')

          var request = new HelloRequest()
          request.setName('World')

          client.sayHello(request, {}, (err, response) => {
            console.log(response.getMessage())
          })
        }}
      >
        Send hello
      </button>
    </div>
  )
}

export default GrpcTest
