export namespace MetadataKey {
  export const controller = Symbol.for('controller')
  export const route      = Symbol.for('route')
  export const argument   = Symbol.for('argument')
}

export enum RouteArgumentType {
  param           = 'param',
  query           = 'query',
  cookie          = 'cookie',
  payload         = 'payload',
  request         = 'request',
  responseToolkit = 'responseToolkit',
}
