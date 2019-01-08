import * as Joi from 'joi'
import { Request, ResponseToolkit } from 'hapi'
import { controller, get, payload, post, res, validate } from 'be-hapi'

const formSchema = Joi.object({
  name: Joi.string().required().min(5).max(10),
})

@controller()
@validate({ failAction: HelloController.handleValidationErrror })
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
  @validate({ payload: formSchema })
  public sayHello(@payload('name') name: string) {
    return `Hi, ${name}!`
  }

  // Hapi lifecycle method for handling validation errors.
  // Responds with error description if validation error occures.

  public static handleValidationErrror(req: Request, h: ResponseToolkit, err: any) {
    return h.response(err.toString()).takeover()
  }
}
