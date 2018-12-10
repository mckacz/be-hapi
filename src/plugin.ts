import * as R from 'ramda'
import { Plugin, Request, ResponseToolkit, Server, ServerRoute } from 'hapi'
import { getControllersMetadata, getRoutesMetadata } from './utils'
import {
  ControllerConstructor,
  ControllerFactory,
  ControllerRouteMetadata,
  PluginOptions,
  RouteSpec,
} from './interfaces'

const defaultValues: PluginOptions = {
  registerController: () => {},

  controllerFactory: (controller) => new controller(),
}

const plugin: Plugin<Partial<PluginOptions>> = {
  name: 'be-hapi',

  register: (server: Server, pluginOptions: Partial<PluginOptions>) => {
    const options = {...defaultValues, ...pluginOptions}

    server.route(getServerRoutes(options))
  },
}

function getServerRoutes(options: PluginOptions): ServerRoute[] {
  const serverRoutes: ServerRoute[] = []

  const controllers = getControllersMetadata()

  for (const controller of controllers) {
    options.registerController(controller.target)

    const routesMetadataByHandler = R.groupBy<ControllerRouteMetadata>(
      R.prop('handlerName'),
      getRoutesMetadata(controller.target),
    )

    for (const handlerName of Object.keys(routesMetadataByHandler)) {
      const routeSpecs: RouteSpec[] = R.map(R.prop('routeSpec'), routesMetadataByHandler[handlerName])

      if (controller.routeSpec) {
        routeSpecs.unshift(controller.routeSpec)
      }

      // prepend default values
      routeSpecs.unshift({
        method: 'GET',
        path:   '/',
      })

      const serverRoute = R.reduce<RouteSpec, RouteSpec>(R.mergeDeepRight, {}, routeSpecs)

      if (controller.basePath) {
        serverRoute.path = controller.basePath + serverRoute.path
      }

      serverRoute.handler = createRouteHandler(options.controllerFactory, controller.target, handlerName)

      serverRoutes.push(serverRoute as ServerRoute)
    }
  }

  return serverRoutes
}

function createRouteHandler<T>(factory: ControllerFactory, constructor: ControllerConstructor<T>, handlerName: string) {
  return (req: Request, h: ResponseToolkit) => {
    const controllerInstance = factory(constructor)
    const handler            = controllerInstance[handlerName]

    return handler.call(controllerInstance, req, h)
  }
}

export default plugin
