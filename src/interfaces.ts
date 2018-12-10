import { ServerRoute } from 'hapi'

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
  (target: any, handlerName: string): void
}

export interface ControllerMetadata<T extends Controller> {
  basePath?: string
  routeSpec?: RouteSpec
  target: ControllerConstructor<T>
}

export interface ControllerRouteMetadata {
  handlerName: string
  routeSpec: RouteSpec
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
