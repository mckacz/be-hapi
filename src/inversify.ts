import { PluginOptions } from './interfaces'

interface InversifyLikeContainer {
  bind(serviceId: any): {
    toSelf(): any;
  }

  get(serviceId: any): any
}

export function useInversify(container: InversifyLikeContainer): PluginOptions {
  return {
    registerController: (c) => container.bind(c).toSelf(),
    controllerFactory: (c) => container.get(c)
  }
}
