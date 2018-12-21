import { MetadataKey } from '../src/constants'

export function cleanGlobalControllerList() {
  if (Reflect.hasMetadata(MetadataKey.controller, Reflect)) {
    Reflect.deleteMetadata(MetadataKey.controller, Reflect)
  }
}
