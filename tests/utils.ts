import { Metadata } from '../src/constants'

export function cleanGlobalControllerList() {
  if (Reflect.hasMetadata(Metadata.controller, Reflect)) {
    Reflect.deleteMetadata(Metadata.controller, Reflect)
  }
}
