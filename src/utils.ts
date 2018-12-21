import { MetadataKey } from './constants'
import {
  Controller,
  ControllerConstructor,
  ControllerMetadata,
  RouteArgumentMetadata,
  RouteMetadata,
} from './interfaces'

export function pushMetadata<T>(metadataKey: any, metadataValue: T, target: any, key?: any) {
  const list: T[] = []

  if (Reflect.hasMetadata(metadataKey, target, key)) {
    list.push(...Reflect.getMetadata(metadataKey, target, key))
  }

  list.push(metadataValue)
  Reflect.defineMetadata(metadataKey, list, target, key)
}

export function getControllersMetadata<T extends Controller>(): Array<ControllerMetadata<T>> {
  if (!Reflect.hasMetadata(MetadataKey.controller, Reflect)) {
    return []
  }

  return Reflect.getMetadata(MetadataKey.controller, Reflect)
}

export function getRoutesMetadata<T extends Controller>(controller: ControllerConstructor<T>): RouteMetadata[] {
  if (!Reflect.hasMetadata(MetadataKey.route, controller)) {
    return []
  }

  return Reflect.getMetadata(MetadataKey.route, controller)
}

export function getRouteArgumentsMetadata<T extends Controller>(
  controller: ControllerConstructor<T>,
  handlerName: string
): RouteArgumentMetadata[] {
  if (!Reflect.hasMetadata(MetadataKey.argument, controller)) {
    return []
  }

  const metadatas: RouteArgumentMetadata[] = Reflect.getMetadata(MetadataKey.argument, controller)

  return metadatas.filter((metadata) => metadata.handlerName === handlerName)
    .sort((a, b) => a.index > b.index ? 1 : -1)
}
