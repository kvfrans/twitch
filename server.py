from sample import *
from bottle import route, run, template, static_file, get, post, request

@post('/predict') # or @route('/login', method='POST')
def predict_post():
    return predict(request.forms.get('message'))

run(host='localhost', port=8001)
