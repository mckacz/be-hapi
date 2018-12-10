import { cleanGlobalControllerList } from './utils'
import { controller, route } from '../src/decorators'
import plugin from '../src/plugin'

describe('Plugin', () => {
  afterEach(cleanGlobalControllerList)

  test('Register routes', () => {
    @controller()
    class Foo {

      @route({method: 'GET'})
      @route({path: '/bar'})
      bar() {

      }

      @route({path: '/baz'})
      baz() {

      }
    }

    const server = {route: jest.fn()}
    plugin.register(<any>server, {})

    expect(server.route).toBeCalledWith([
      {
        handler: expect.any(Function),
        method:  'GET',
        path:    '/bar',
      },
      {
        handler: expect.any(Function),
        method:  'GET',
        path:    '/baz',
      },
    ])
  })

  test('Register routes with base path', () => {
    @controller('/foo')
    class Foo {

      @route({method: 'GET'})
      @route({path: '/bar'})
      bar() {

      }

      @route({path: '/baz'})
      baz() {

      }
    }

    const server = {route: jest.fn()}
    plugin.register(<any>server, {})

    expect(server.route).toBeCalledWith([
      {
        handler: expect.any(Function),
        method:  'GET',
        path:    '/foo/bar',
      },
      {
        handler: expect.any(Function),
        method:  'GET',
        path:    '/foo/baz',
      },
    ])
  })

  test('Register routes with base route spec', () => {
    @controller('', {method: 'POST'})
    class Foo {

      @route({method: 'GET'})
      @route({path: '/bar'})
      bar() {

      }

      @route({path: '/baz'})
      baz() {

      }
    }

    const server = {route: jest.fn()}
    plugin.register(<any>server, {})

    expect(server.route).toBeCalledWith([
      {
        handler: expect.any(Function),
        method:  'GET',
        path:    '/bar',
      },
      {
        handler: expect.any(Function),
        method:  'POST',
        path:    '/baz',
      },
    ])
  })

  test('Register routes with classic route handler', () => {
    @controller()
    class Foo {

      @route({path: '/bar'})
      bar(req: any, h: any) {
        return ['baz', req, h].join(' ')
      }
    }

    const server = {route: jest.fn()}

    const options = {
      registerController: jest.fn(),
      controllerFactory:  jest.fn((contr) => new contr()),
    }

    plugin.register(<any>server, options)

    expect(options.registerController).toBeCalledWith(Foo)

    const handler  = server.route.mock.calls[0][0][0].handler
    const response = handler('req', 'reskit')
    handler('req', 'reskit')

    expect(options.controllerFactory).toBeCalledTimes(2)
    expect(options.controllerFactory).toBeCalledWith(Foo)
    expect(response).toEqual('baz req reskit')
  })
})
