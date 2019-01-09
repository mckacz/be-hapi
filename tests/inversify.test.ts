import { useInversify } from '../src'

describe('Inversify helper', () => {
  test('useInversify() provides correct registerController option', () => {
    const toSelf = jest.fn()
    const controller: any = Symbol()

    const container = {
      get: jest.fn(),
      bind: jest.fn(() => ({ toSelf })),
    }

    const options = useInversify(container)

    options.registerController(controller)
    expect(container.bind).toBeCalledWith(controller)
    expect(toSelf).toBeCalled()
  })

  test('useInversify() provides correct registerController option', () => {
    const controller: any = Symbol()
    const instance: any = Symbol()

    const container = {
      get: jest.fn(() => instance),
      bind: jest.fn(),
    }

    const options = useInversify(container)

    expect(options.controllerFactory(controller)).toBe(instance)
    expect(container.get).toBeCalledWith(controller)
  })
})
