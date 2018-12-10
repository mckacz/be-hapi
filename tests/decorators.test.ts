import { controller, route } from '../src/decorators'
import { Metadata } from '../src/constants'
import { cleanGlobalControllerList } from './utils'

describe('Decorators', () => {
  afterEach(cleanGlobalControllerList)

  describe('@controller', () => {

    test('ControllerConstructor metadata should be added to decorated class', () => {
      @controller('/foo', {options: {tags: ['bar']}})
      class Foo {

      }

      expect(Reflect.hasMetadata(Metadata.controller, Foo)).toBeTruthy()
      expect(Reflect.getMetadata(Metadata.controller, Foo)).toEqual({
        target:    Foo,
        basePath:  '/foo',
        routeSpec: {
          options: {
            tags: ['bar'],
          },
        },
      })
    })

    test('ControllerConstructor metadata should be added to global list of controllers', () => {
      @controller('/foo', {options: {tags: ['bar']}})
      class Foo {}

      expect(Reflect.hasMetadata(Metadata.controller, Reflect)).toBeTruthy()
      expect(Reflect.getMetadata(Metadata.controller, Reflect)).toEqual([
        {
          target:    Foo,
          basePath:  '/foo',
          routeSpec: {
            options: {
              tags: ['bar'],
            },
          },
        },
      ])
    })

    test('Error is thrown if controller is decorated more than once', () => {
      expect(() => {
        @controller()
        @controller()
        class Foo {}
      }).toThrow()
    })
  })

  describe('@route', () => {
    test('Route metadata should be added to list of route metadata in constructor of the class', () => {
      class Foo {
        @route({path: '/bar'})
        bar() {}
      }

      expect(Reflect.hasMetadata(Metadata.route, Foo)).toBeTruthy()
      expect(Reflect.getMetadata(Metadata.route, Foo)).toEqual([
        {
          handlerName: 'bar',
          routeSpec:   {path: '/bar'},
        },
      ])
    })
  })
})
