import { RouteOptions, Util } from 'hapi'
import { MetadataKey, RouteArgumentType } from './constants'
import { ControllerAlreadyDecoratedError } from './errors'
import { pushMetadata } from './utils'
import {
  ArgumentDecorator,
  Controller,
  ControllerConstructor,
  ControllerDecorator,
  ControllerMetadata,
  RouteArgumentMetadata,
  RouteDecorator,
  RouteSpec,
} from './interfaces'

type OneOrMore<T> = T | T[]

export function controller<T extends Controller>(basePath?: string, routeSpec?: RouteSpec): ControllerDecorator {
  return function (target: ControllerConstructor<T>) {
    if (Reflect.hasMetadata(MetadataKey.controller, target)) {
      throw new ControllerAlreadyDecoratedError(target)
    }

    const metadata: ControllerMetadata<T> = {
      basePath,
      routeSpec,
      target,
    }

    Reflect.defineMetadata(MetadataKey.controller, metadata, target)
    pushMetadata(MetadataKey.controller, metadata, Reflect)
  }
}

export function route(routeSpec: RouteSpec): RouteDecorator {
  return function (target, handlerName) {
    if (handlerName) {        // decorated class method
      pushMetadata(
        MetadataKey.route,
        {
          handlerName,
          routeSpec,
        },
        target.constructor
      )
    } else {                  // decorated class
      pushMetadata(
        MetadataKey.route,
        {
          handlerName: '',
          routeSpec,
        },
        target
      )
    }
  }
}

//tslint:disable:no-shadowed-variable Just for convenience

export function method(method: OneOrMore<Util.HTTP_METHODS_PARTIAL> | OneOrMore<string>, path?: string) {
  const spec: RouteSpec = { method }

  if (path !== undefined) {
    spec.path = path
  }

  return route(spec)
}

export function get(path?: string) { return method('GET', path) }
export function post(path?: string) { return method('POST', path) }
export function put(path?: string) { return method('PUT', path) }
export function patch(path?: string) { return method('PATCH', path) }
export function del(path?: string) { return method('DELETE', path) }
export function options(path?: string) { return method('OPTIONS', path) }
export function all(path?: string) { return method('*', path) }
export function path(path: string) { return route({ path })}
export function vhost(vhost: OneOrMore<string>) { return route({ vhost })}
export function rules(rules: object) { return route({ rules })}
export function routeOptions(options: RouteOptions) { return route({ options })}

export function routeOption<K extends keyof RouteOptions>(
  name: K,
  value: RouteOptions[K]
) {
  return routeOptions({ [name]: value })
}

export function cache(value: RouteOptions['cache']) { return routeOption('cache', value) }
export function cors(value: RouteOptions['cors']) { return routeOption('cors', value) }
export function description(value: RouteOptions['description']) { return routeOption('description', value) }
export function notes(value: RouteOptions['notes']) { return routeOption('notes', value) }
export function plugin(name: string, options: any) { return routeOption('plugins', { [name]: options }) }
export function pre(value: RouteOptions['pre']) { return routeOption('pre', value) }
export function response(value: RouteOptions['response']) { return routeOption('response', value) }
export function security(value: RouteOptions['security']) { return routeOption('security', value) }
export function tags(value: RouteOptions['tags']) { return routeOption('tags', value) }
export function validate(value: RouteOptions['validate']) { return routeOption('validate', value) }

export function param(name: string, defaultValue?: any): ArgumentDecorator {
  return function (target, handlerName, index) {
    const metadata: RouteArgumentMetadata = {
      type: RouteArgumentType.param,
      handlerName,
      index,
      name,
      defaultValue,
    }

    pushMetadata(MetadataKey.argument, metadata, target.constructor)
  }
}

export function queryParam(name: string, defaultValue?: any): ArgumentDecorator {
  return function (target, handlerName, index) {
    const metadata: RouteArgumentMetadata = {
      type: RouteArgumentType.query,
      handlerName,
      index,
      name,
      defaultValue,
    }

    pushMetadata(MetadataKey.argument, metadata, target.constructor)
  }
}

export function cookie(name: string, defaultValue?: any): ArgumentDecorator {
  return function (target, handlerName, index) {
    const metadata: RouteArgumentMetadata = {
      type: RouteArgumentType.cookie,
      handlerName,
      index,
      name,
      defaultValue,
    }

    pushMetadata(MetadataKey.argument, metadata, target.constructor)
  }
}

export function payload(name?: string, defaultValue?: any): ArgumentDecorator {
  return function (target, handlerName, index) {
    const metadata: RouteArgumentMetadata = {
      type: RouteArgumentType.payload,
      handlerName,
      index,
      name,
      defaultValue
    }

    pushMetadata(MetadataKey.argument, metadata, target.constructor)
  }
}

export function request(): ArgumentDecorator {
  return function (target, handlerName, index) {
    const metadata: RouteArgumentMetadata = {
      type: RouteArgumentType.request,
      handlerName,
      index,
    }

    pushMetadata(MetadataKey.argument, metadata, target.constructor)
  }
}

export function responseToolkit(): ArgumentDecorator {
  return function (target, handlerName, index) {
    const metadata: RouteArgumentMetadata = {
      type: RouteArgumentType.responseToolkit,
      handlerName,
      index,
    }

    pushMetadata(MetadataKey.argument, metadata, target.constructor)
  }
}

export function req() {
  return request()
}

export function res() {
  return responseToolkit()
}
