import 'reflect-metadata'                                       // Reflect API support
import { Server } from 'hapi'                                   // hapi server
import { Container } from 'inversify'

import inert from 'inert'                                                      // plugin to server static content
import beHapi, { useInversify } from 'be-hapi'                  // be-hapi plugin with helper

import { NameTransformer } from './service'                     // import name transforming service
import './controller'                                           // import the controller

(async () => {
  const container = new Container()                             // create Inversify container
  container.bind(NameTransformer).toSelf()

  const server = new Server({ port: 3000 })                     // hapi server will be listening on port 3000
  await server.register(inert)                                  // register inert
  await server.register({                                       // register be-hapi plugin with Inversify support
    plugin: beHapi,
    options: useInversify(container)
  })

  await server.start()                                       // start the server

  console.log(`Open http://localhost:${server.info.port}/`)
})()
