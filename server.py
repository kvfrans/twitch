from sample import *
import bottle
from bottle import route, run, template, static_file, get, post, request, response

# the decorator
def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        # set CORS headers
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        if bottle.request.method != 'OPTIONS':
            # actual request; reply with the actual response
            return fn(*args, **kwargs)

    return _enable_cors

@post('/predict') # or @route('/login', method='POST')
@enable_cors
def predict_post():
    return predict(request.forms.get('message'))

@post('/temp') # or @route('/login', method='POST')
@enable_cors
def tempp():
    return "got it oss"

@get('/') # or @route('/login', method='POST')
@enable_cors
def index():
    return "yup"


run(host='localhost', port=8080)
