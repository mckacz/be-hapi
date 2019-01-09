import { cleanGlobalControllerList } from './utils'
import * as D from '../src/decorators'
import plugin from '../src'

describe('Plugin', () => {
  afterEach(cleanGlobalControllerList)

  test('Register routes', () => {
    @D.controller()
    class Foo {

      @D.route({method: 'GET'})
      @D.route({path: '/bar'})
      bar() {

      }

      @D.route({path: '/baz'})
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
    @D.controller('/foo')
    class Foo {

      @D.route({method: 'GET'})
      @D.route({path: '/bar'})
      bar() {

      }

      @D.route({path: '/baz'})
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
    @D.controller('', {method: 'POST'})
    class Foo {

      @D.route({method: 'GET'})
      @D.route({path: '/bar'})
      bar() {

      }

      @D.route({path: '/baz'})
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

  test('Register routes with base route spec defined with decorator', () => {
    @D.post()
    @D.controller()
    class Foo {

      @D.route({method: 'GET'})
      @D.route({path: '/bar'})
      bar() {

      }

      @D.route({path: '/baz'})
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
    @D.controller()
    class Foo {

      @D.route({path: '/bar'})
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

  describe('Routes with injected arguments', () => {
    //mocked request
    const req = {
      params: {
        foo: 'foooo',
        bar: 'baz',
      },

      query: {
        foo: 'bar',
      },

      state: {
        foo: 'quux',
      },

      payload: { foo: 'payload', bar: { baz: 'quux' } },
    }

    //mocked response toolkit
    const h = Symbol('responseTooltik')

    test.each([
      // decorator          arguments         expected value
      ['param',             ['foo'],          'foooo'],
      ['param',             ['foo', 'bar'],   'foooo'],
      ['param',             ['baz'],          undefined],
      ['param',             ['baz', 'bar'],   'bar'],
      ['queryParam',        ['foo'],          'bar'],
      ['queryParam',        ['foo', 'baz'],   'bar'],
      ['queryParam',        ['baz'],          undefined],
      ['queryParam',        ['baz', 'qux'],   'qux'],
      ['cookie',            ['foo'],          'quux'],
      ['cookie',            ['foo', 'bar'],   'quux'],
      ['cookie',            ['bar'],          undefined],
      ['cookie',            ['bar', 'baz'],   'baz'],
      ['payload',           [],               { foo: 'payload', bar: { baz: 'quux' } }],
      ['payload',           ['foo'],          'payload'],
      ['payload',           ['bar.baz'],      'quux'],
      ['payload',           ['baz', 'foo'],   'foo'],
      ['payload',           ['baz'],          undefined],
      ['request',           [],               req],
      ['responseToolkit',   [],               h],

    ])('@%s with args %p', (name, args, expectedValue) => {
      const decorator = (<any>D)[name]

      @D.controller()
      class Foo {

        @D.route({path: '/bar'})
        bar(@decorator(...args) param: any) {
          return param
        }
      }

      const server = {route: jest.fn()}

      const options = {
        registerController: jest.fn(),
      }

      plugin.register(<any>server, options)

      const handler  = server.route.mock.calls[0][0][0].handler
      const value = handler(req, h)

      expect(value).toEqual(expectedValue)
    })

    test('Undecorated arguments are set to undefined', () => {
      @D.controller()
      class Foo {

        @D.route({path: '/bar'})
        bar(@D.param('foo') a: any, b: any, @D.queryParam('foo') c: any) {
          return [a, b, c]
        }
      }

      const server = {route: jest.fn()}

      const options = {
        registerController: jest.fn(),
      }

      plugin.register(<any>server, options)

      const handler  = server.route.mock.calls[0][0][0].handler
      const value = handler(req, h)

      expect(value).toEqual(['foooo', undefined, 'bar'])
    })
  })
})
