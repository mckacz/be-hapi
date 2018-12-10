import { getControllersMetadata, getRoutesMetadata, pushMetadata } from '../src/utils'
import { Metadata } from '../src/constants'

describe('Utils', () => {

  describe('pushMetadata()', () => {
    test('List with metadata should be created when not exist', () => {
      const target = {}
      pushMetadata('foo', 'bar', target)

      expect(Reflect.getMetadata('foo', target)).toEqual(['bar'])
    })

    test('Metadata should be added to existing list', () => {
      const target = {}

      Reflect.defineMetadata('foo', ['baz'], target)
      pushMetadata('foo', 'bar', target)

      expect(Reflect.getMetadata('foo', target)).toEqual(['baz', 'bar'])
    })
  })

  describe('getControllersMetadata()', () => {
    afterEach(() => {
      Reflect.deleteMetadata(Metadata.controller, Reflect)
    })

    test('Returns empty list if there is no metadata', () => {
      expect(getControllersMetadata()).toEqual([])
    })

    test('Returns list of metadata', () => {
      Reflect.defineMetadata(Metadata.controller, ['foo'], Reflect)

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

      Reflect.defineMetadata(Metadata.route, ['foo'], Foo)

      expect(getRoutesMetadata(Foo)).toEqual(['foo'])
    })
  })

})
