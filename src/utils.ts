import { Metadata } from './constants'
import { Controller, ControllerConstructor, ControllerMetadata, ControllerRouteMetadata } from './interfaces'

export function pushMetadata<T>(metadataKey: any, metadataValue: T, target: any, key?: any) {
  const list: T[] = []

  if (Reflect.hasMetadata(metadataKey, target, key)) {
    list.push(...Reflect.getMetadata(metadataKey, target, key))
  }

  list.push(metadataValue)
  Reflect.defineMetadata(metadataKey, list, target, key)
}

export function getControllersMetadata<T extends Controller>(): Array<ControllerMetadata<T>> {
  if (!Reflect.hasMetadata(Metadata.controller, Reflect)) {
    return []
  }

  return Reflect.getMetadata(Metadata.controller, Reflect)
}

export function getRoutesMetadata<T extends Controller>(
  controller: ControllerConstructor<T>,
): ControllerRouteMetadata[] {
  if (!Reflect.hasMetadata(Metadata.route, controller)) {
    return []
  }

  return Reflect.getMetadata(Metadata.route, controller)
}
