import { getControllersMetadata, getRouteArgumentsMetadata, getRoutesMetadata, pushMetadata } from '../src/utils'
import { MetadataKey } from '../src/constants'

describe('Utils', () => {

  describe('pushMetadata()', () => {
    test('List with metadata should be created when not exist', () => {
      const target = {}
      pushMetadata('foo', 'bar', target)

      expect(Reflect.getMetadata('foo', target)).toEqual(['bar'])
    })

    test('MetadataKey should be added to existing list', () => {
      const target = {}

      Reflect.defineMetadata('foo', ['baz'], target)
      pushMetadata('foo', 'bar', target)

      expect(Reflect.getMetadata('foo', target)).toEqual(['baz', 'bar'])
    })
  })

  describe('getControllersMetadata()', () => {
    afterEach(() => {
      Reflect.deleteMetadata(MetadataKey.controller, Reflect)
    })

    test('Returns empty list if there is no metadata', () => {
      expect(getControllersMetadata()).toEqual([])
    })

    test('Returns list of metadata', () => {
      Reflect.defineMetadata(MetadataKey.controller, ['foo'], Reflect)

      expect(getControllersMetadata()).toEqual(['foo'])
    })
  })

  describe('getRoutesMetadata()', () => {
    test('Returns empty list if there is no metadata', () => {
      class Foo {}

      expect(getRoutesMetadata(Foo)).toEqual([])
    })

    test('Returns list of metadata', () => {
      class Foo {}

      Reflect.defineMetadata(MetadataKey.route, ['foo'], Foo)

      expect(getRoutesMetadata(Foo)).toEqual(['foo'])
    })
  })

  describe('getRouteArgumentsMetadata()', () => {
    test('Returns empty list if there is no metadata', () => {
      class Foo {}

      expect(getRouteArgumentsMetadata(Foo, 'bar')).toEqual([])
    })

    test('Returns list of metadata with correct order and filtered by handler name ', () => {
      class Foo {}

      Reflect.defineMetadata(
        MetadataKey.argument,
        [
          { foo: 123, handlerName: 'foo', index: 1 },
          { foo: 456, handlerName: 'bar', index: 0 },
          { foo: 234, handlerName: 'foo', index: 0 },
        ],
        Foo
      )

      expect(getRouteArgumentsMetadata(Foo, 'foo')).toEqual([
        { foo: 234, handlerName: 'foo', index: 0 },
        { foo: 123, handlerName: 'foo', index: 1 },
      ])
    })

  })

})
