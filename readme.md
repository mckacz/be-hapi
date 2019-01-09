# be-hapi

[![CircleCI](https://circleci.com/gh/mckacz/be-hapi/tree/master.svg?style=svg)](https://circleci.com/gh/mckacz/be-hapi/tree/master) 
[![npm version](https://badge.fury.io/js/be-hapi.svg)](https://badge.fury.io/js/be-hapi) 
[![Dependencies](https://david-dm.org/mckacz/be-hapi.svg)](https://david-dm.org/mckacz/be-hapi#info=dependencies) 
[![devDependencies](https://david-dm.org/mckacz/be-hapi/dev-status.svg)](https://david-dm.org/mckacz/be-hapi/#info=devDependencies)
 [![Known Vulnerabilities](https://snyk.io/test/github/mckacz/be-hapi/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mckacz/be-hapi?targetFile=package.json)

[![NPM](https://nodei.co/npm/be-hapi.png)](https://nodei.co/npm/be-hapi/)

Decorated class-based controllers for Hapi with IoC support (like [InversifyJS](https://github.com/inversify/InversifyJS)).

## Installation

You can get latest release with type definitions from NPM:

```
npm install be-hapi reflect-metadata --save
```
    
**be-hapi** requires TypeScript >= 2.0 and the `experimentalDecorators`, `lib` and `types` compilation option.

```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["es6"],
        "types": ["reflect-metadata"],
        "module": "commonjs",
        "moduleResolution": "node",
        "experimentalDecorators": true
    }
}
```

## Usage

Very basic  usage:

### 1. Create your first controller class

```ts
//controller.ts
import { controller, get, param } from 'be-hapi'

@controller()
class HelloController {

  @get('/{name?}')
  public index(
    @param('name', 'You') name: string
  ) {
    return `Hi, ${name}!`
  }

}
```

### 2. Register the plugin with Hapi

```ts
// server.ts
import { Server } from 'hapi' 
import beHapi from 'be-hapi'

// import previously created controller
import './controller'

(async () => {
    const server = new Server({ port: 3000 })
    await server.register(beHapi)
    await server.start()
})()
```

Now, compile, start the app and go to `http://localhost:3000/`.

### More examples

* [simple app](./examples/simple)
* [app with validation](./examples/validation)
* [example usage with InversifyJS](./examples/inversify)


## API

### Plugin options

| Name | Type | Description |
|------|------|-------------|
| `registerController` | `(controller: ControllerConstructor) => void` | Function called on controller registration. Called once for each discovered controller. |
| `controllerFactory` | `(controller: ControllerConstructor) => object` | Function called that should return instance of controller. Called on **each** request to the controller. If not specified, returns new instance of controller class. |

### Available decorators

| Name | Target | Description |
|------|--------|-------------|
| `@controller(basePath?, baseRouteSpec?)` | Class | Decorates controller class. Can specify base path prefix and base [route spec](https://hapijs.com/api#server.route()) for all routes of the controller. |
| `@route(routeSpec)` | Method, Class* | Sets [route spec](https://hapijs.com/api#server.route()). |
| `@path(path)` | Method, Class* | Sets path for the route. |
| `@method(httpMethod)` | Method, Class* | Sets HTTP method (eg. GET, POST...) |
| `@get(path?)` | Method, Class* | Sets HTTP method to GET. Optionally set path for the route. | 
| `@post(path?)` | Method, Class* | Sets HTTP method to POST. Optionally set path for the route. | 
| `@put(path?)` | Method, Class* | Sets HTTP method to PUT. Optionally set path for the route. | 
| `@patch(path?)` | Method, Class* | Sets HTTP method to PATCH. Optionally set path for the route. | 
| `@del(path?)` | Method, Class* | Sets HTTP method to DELETE. Optionally set path for the route. | 
| `@options(path?)` | Method, Class* | Sets HTTP method to OPTIONS. Optionally set path for the route. | 
| `@all(path?)` | Method, Class* | Sets HTTP method to `*`. Optionally set path for the route. | 
| `@vhost(hostOrHosts)` | Method, Class* | Sets virtual host. |
| `@rules(rules)` | Method, Class*  | Sets [custom rules](https://hapijs.com/api#-routeoptionsrules). | 
| `@routeOptions(options)` | Method, Class*  | Sets [route options](https://hapijs.com/api#yar-route-options). | 
| `@routeOption(name, value)` | Method, Class*  | Sets single [route option](https://hapijs.com/api#yar-route-options). | 
| `@cache(value)` | Method, Class*  | Sets cache option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@cors(value)` | Method, Class*  | Sets cors option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@description(value)` | Method, Class*  | Sets description option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@notes(value)` | Method, Class*  | Sets notes option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@pre(value)` | Method, Class*  | Sets pre option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@response(value)` | Method, Class*  | Sets response option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@security(value)` | Method, Class*  | Sets security option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@tags(value)` | Method, Class*  | Sets tags option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@validate(value)` | Method, Class*  | Sets validate option. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@plugin(name, options)` | Method, Class*  | Sets plugin options. See [route option](https://hapijs.com/api#yar-route-options). | 
| `@param(name,defaultValue?)` | Method parameter  | Inject specified request param. | 
| `@queryParam(name,defaultValue?)` | Method parameter  | Inject specified request query param. | 
| `@cookie(name,defaultValue?)` | Method parameter  | Inject specified request cookie value. | 
| `@payload(name?,defaultValue?)` | Method parameter  | Inject request payload. If `name` would be specified, only requested property from payload will be injected. | 
| `@request()`, `@req()` | Method parameter  | Inject request object. | 
| `@responseToolkit()`, `@res()` | Method parameter  | Inject response toolkit object. | 

_Footnotes:_

Class* - you can decorate controller with method decorators to set base route specification for all routes in decorated controller.

### Helpers

`useInversify(container)` - returns plugin options to easy integrate InversifyJS. See [example](./examples/inversify/src/server.ts#L17-L20).