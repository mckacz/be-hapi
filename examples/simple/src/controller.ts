import { ResponseToolkit } from '@hapi/hapi'
import { controller, get, payload, post, res } from 'be-hapi'

@controller()
class HelloController {

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
    return `Hi, ${name}!`
  }
}
