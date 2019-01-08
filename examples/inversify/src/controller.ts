import { injectable } from 'inversify'
import { ResponseToolkit } from 'hapi'
import { controller, get, payload, post, res } from 'be-hapi'
import { NameTransformer } from './service'

@injectable()
@controller()
class HelloController {

  // Transformer will be injected by Inversify

  constructor(private transformer: NameTransformer) {

  }

  // Main page handler (GET /).
  // Serves content of file `static/index.html` via inert plugin that add `file` method to ResponseToolkit.

  @get('/')
  public index(@res() h: ResponseToolkit) {
    return h.file('static/index.html')
  }

  // Form submission handler (POST /).
  // Responds with Hi to `name` submitted via form from main page.

  @post('/')
  public sayHello(@payload('name') name: string) {
    return `Hi, ${this.transformer.process(name)}!`
  }
}
