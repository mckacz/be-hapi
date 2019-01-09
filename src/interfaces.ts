import { ServerRoute } from 'hapi'
import { RouteArgumentType } from './constants'

export type RouteSpec = Partial<ServerRoute>

export interface ControllerConstructor<T extends Controller> {
  new(...args: any[]): T
}

export interface Controller {
  [handlerName: string]: any
}

export interface ControllerDecorator {
  (target: any): void
}

export interface RouteDecorator {
  (target: any, handlerName?: string): void
}

export interface ArgumentDecorator {
  (target: any, handlerName: string, index: number): void
}

export interface ControllerMetadata<T extends Controller> {
  basePath?: string
  routeSpec?: RouteSpec
  target: ControllerConstructor<T>
}

export interface RouteMetadata {
  handlerName: string
  routeSpec: RouteSpec
}

export interface RouteArgumentMetadata {
  handlerName: string
  index: number
  type: RouteArgumentType
  name?: string
  defaultValue?: any
}

export interface PluginOptions {
  registerController: RegisterController
  controllerFactory: ControllerFactory
}

export interface ControllerFactory<T = any> {
  (controller: ControllerConstructor<T>): Controller
}

export interface RegisterController<T = any> {
  (controller: ControllerConstructor<T>): void | Promise<void>
}
