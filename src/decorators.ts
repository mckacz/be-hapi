import { Metadata } from './constants'
import { ControllerAlreadyDecoratedError } from './errors'
import { pushMetadata } from './utils'
import {
  Controller,
  ControllerConstructor,
  ControllerDecorator,
  ControllerMetadata,
  ControllerRouteMetadata,
  RouteDecorator,
  RouteSpec,
} from './interfaces'

export function controller<T extends Controller>(basePath?: string, routeSpec?: RouteSpec): ControllerDecorator {
  return function (target: ControllerConstructor<T>) {
    if (Reflect.hasMetadata(Metadata.controller, target)) {
      throw new ControllerAlreadyDecoratedError(target)
    }

    const metadata: ControllerMetadata<T> = {
      basePath,
      routeSpec,
      target,
    }

    Reflect.defineMetadata(Metadata.controller, metadata, target)
    pushMetadata(Metadata.controller, metadata, Reflect)
  }
}

export function route(routeSpec: RouteSpec): RouteDecorator {
  return function (target, handlerName) {
    const metadata: ControllerRouteMetadata = {
      handlerName,
      routeSpec,
    }

    pushMetadata(Metadata.route, metadata, target.constructor)
  }
}
