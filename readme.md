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
