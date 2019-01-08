import { injectable } from 'inversify'

@injectable()
export class NameTransformer {
  public process(name: string) {
    return `<strong>${name}</strong>`
  }
}
