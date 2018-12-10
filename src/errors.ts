import { ControllerConstructor } from './interfaces'

export abstract class BaseError extends Error {

}

export class ControllerAlreadyDecoratedError extends BaseError {
  constructor(controller: ControllerConstructor<any>) {
    super(`Controller "${(<Function>controller).name}" is already decorated by @controller annotation`)
  }
}
