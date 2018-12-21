import * as R from 'ramda'
import { Plugin, Request, RequestQuery, ResponseToolkit, Server, ServerRoute } from 'hapi'
import { getControllersMetadata, getRouteArgumentsMetadata, getRoutesMetadata } from './utils'
import { RouteArgumentType } from './constants'
import {
  ControllerConstructor,
  ControllerFactory,
  PluginOptions,
  RouteArgumentMetadata,
  RouteMetadata,
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

    const routesMetadataByHandler = R.groupBy<RouteMetadata>(
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

function resolveHandlerArguments(metadatas: RouteArgumentMetadata[], req: Request, h: ResponseToolkit): any[] {
  if (metadatas.length === 0) {
    return [req, h]
  }

  const args: any[] = []

  for (const metadata of metadatas) {
    while (args.length < metadata.index) {
      args.push(undefined)
    }

    switch (metadata.type) {
      case RouteArgumentType.param:
        args.push(req.params[metadata.name as string] || metadata.defaultValue)
        break

      case RouteArgumentType.query:
        args.push((req.query as RequestQuery)[metadata.name as string] || metadata.defaultValue)
        break

      case RouteArgumentType.cookie:
        args.push(req.state[metadata.name as string] || metadata.defaultValue)
        break

      case RouteArgumentType.payload:
        if (metadata.name) {
          args.push(R.path(metadata.name.split('.'), req.payload) || metadata.defaultValue)
        } else {
          args.push(req.payload)
        }

        break

      case RouteArgumentType.request:
        args.push(req)
        break

      case RouteArgumentType.responseToolkit:
        args.push(h)
    }
  }

  return args
}

function createRouteHandler<T>(factory: ControllerFactory, constructor: ControllerConstructor<T>, handlerName: string) {
  const metadatas = getRouteArgumentsMetadata(constructor, handlerName)

  return (req: Request, h: ResponseToolkit) => {
    const controllerInstance = factory(constructor)
    const handler            = controllerInstance[handlerName]
    const args               = resolveHandlerArguments(metadatas, req, h)

    return handler.apply(controllerInstance, args)
  }
}

export default plugin
