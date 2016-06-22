# Working example for my blog post at:
# http://danijar.com/introduction-to-recurrent-networks-in-tensorflow/
import functools
import sets
import tensorflow as tf
from random import randint
import numpy as np
from bottle import route, run, template, static_file, get, post, request
import os
import json
# from tensorflow.models.rnn import rnn_cell
# from tensorflow.models.rnn import rnn


def lazy_property(function):
    attribute = '_' + function.__name__

    @property
    @functools.wraps(function)
    def wrapper(self):
        if not hasattr(self, attribute):
            setattr(self, attribute, function(self))
        return getattr(self, attribute)
    return wrapper


class SequenceClassification:

    def __init__(self, data, target, dropout, num_hidden=200, num_layers=3):
        self.data = data
        self.target = target
        self.dropout = dropout
        self._num_hidden = num_hidden
        self._num_layers = num_layers
        self.prediction
        self.error
        self.optimize

    @lazy_property
    def prediction(self):

        embeds = tf.Variable(tf.truncated_normal([2035, self._num_hidden], stddev=0.01))
        # embedding = tf.batch_matmul(data, embeds)
        embedding = tf.reshape(tf.matmul(tf.reshape(data,[-1,2035]),embeds,a_is_sparse=True),[-1,10,200])

        # Recurrent network.
        network = tf.nn.rnn_cell.LSTMCell(self._num_hidden)
        network = tf.nn.rnn_cell.DropoutWrapper(
            network, output_keep_prob=self.dropout)
        network = tf.nn.rnn_cell.MultiRNNCell([network] * self._num_layers)
        output, _ = tf.nn.dynamic_rnn(network, embedding, dtype=tf.float32)
        # Select last output.
        output = tf.transpose(output, [1, 0, 2])
        last = tf.gather(output, int(output.get_shape()[0]) - 1)
        # Softmax layer.
        weight, bias = self._weight_and_bias(
            self._num_hidden, int(self.target.get_shape()[1]))
        prediction = tf.nn.softmax(tf.matmul(last, weight) + bias)
        return prediction

    @lazy_property
    def cost(self):
        cross_entropy = -tf.reduce_sum(self.target * tf.log(self.prediction))
        return cross_entropy

    @lazy_property
    def optimize(self):
        learning_rate = 0.0003
        optimizer = tf.train.RMSPropOptimizer(learning_rate)
        return optimizer.minimize(self.cost)

    @lazy_property
    def error(self):
        mistakes = tf.not_equal(
            tf.argmax(self.target, 1), tf.argmax(self.prediction, 1))
        return tf.reduce_mean(tf.cast(mistakes, tf.float32))

    @staticmethod
    def _weight_and_bias(in_size, out_size):
        weight = tf.truncated_normal([in_size, out_size], stddev=0.01)
        bias = tf.constant(0.1, shape=[out_size])
        return tf.Variable(weight), tf.Variable(bias)


num_classes = 161
data = tf.placeholder(tf.float32, [None, 10, 2035])
target = tf.placeholder(tf.float32, [None, 161])
dropout = tf.placeholder(tf.float32)

model = SequenceClassification(data, target, dropout)
sess = tf.Session()
sess.run(tf.initialize_all_variables())

saver = tf.train.Saver()

istrain = False

train_data = np.load("data.npy")
train_labels = np.load("labels.npy")

with open('words.json') as data_file:
    wordsdata = json.load(data_file)

if istrain:
    # train_data = np.load("data.npy")
    # train_labels = np.load("labels.npy")
    print np.shape(train_data)
    for epoch in range(1000):
        for i in range(354):
            rand = i
            # rand = randint(0,6100)
            x = train_data[rand:rand+64,:,:]
            y = train_labels[rand:rand+64,:]
            sess.run(model.optimize, {data: x, target: y, dropout: 0.5})
            # print i
            if i % 50 == 0:
                error, co = sess.run([model.error, model.cost], {data: x, target: y, dropout: 1})
                print('Epoch {:2d} error {:3.1f}%  cost {:3.1f}'.format(epoch + 1, 100 * error, co))

        saver.save(sess, os.getcwd()+"/training/train",global_step=epoch)
else:
    saver.restore(sess, tf.train.latest_checkpoint(os.getcwd()+"/training/"))
    rand = 50
    x = train_data[rand:rand+64,:,:]
    y = train_labels[rand:rand+64,:]
    preds = sess.run([model.prediction], {data: x, target: y, dropout: 1})[0]

    print "checking alignment"
    for i in xrange(20):
        inwords = np.argmax(x[i],axis=1)
        inwordslist = inwords.tolist()
        print inwords
        ss = ""
        for k in inwordslist:
            for key, item in wordsdata:
                if item == k:
                    ss = ss + " " + key
        print ss


        print np.argmax(y[i],axis=0)

    print np.shape(y)
    print np.shape(preds)

    print np.argmax(y,axis=1)
    print np.argmax(preds,axis=1)

@route('/')
def index():
    return "same"

@post('/classify') # or @route('/login', method='POST')
def classify():
    message = request.forms.get('message')
    wordarray = np.zeros([64,10,2035], dtype=np.int)



    words = message.split()
    print words
    for l in xrange(min(10,len(words))):
        word = words[l].lower()
        if word in wordsdata:
            print word
            print wordsdata[word]
            wordarray[:,l,wordsdata[word]] = 1
    preds = sess.run([model.prediction], {data: wordarray, dropout: 1})
    preds = preds[0]
    # print np.shape(preds)
    np.set_printoptions(threshold=np.nan)
    emojipreds = np.argmax(preds,axis=1)[0]
    print "prediction:"
    print emojipreds
    # for i in xrange(161):
        # print str(i) + ": " + str(int(round(preds[0][i]*100)))
    # json_string = json.dumps(preds.tolist())
    # return json_string + "<br>" + str(np.argmax(preds))
    # return
    return "test"

run(host='localhost', port=8080)
