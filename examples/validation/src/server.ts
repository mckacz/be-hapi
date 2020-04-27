import 'reflect-metadata'                                    // Reflect API support
import { Server } from '@hapi/hapi'                          // hapi server

import inert from '@hapi/inert'                              // plugin to server static content
import beHapi from 'be-hapi'                                 // be-hapi plugin

import './controller'                                        // import the controller

(async () => {
  const server = new Server({ port: 3000 })                  // hapi server will be listening on port 3000
  await server.register([inert, beHapi])                     // register both plugins
  await server.start()                                       // start the server

  console.log(`Open http://localhost:${server.info.port}/`)
})()
