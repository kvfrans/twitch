# Working example for my blog post at:
# http://danijar.com/introduction-to-recurrent-networks-in-tensorflow/
import functools
import sets
import tensorflow as tf
from random import randint
import numpy as np
import os
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

        embeds = tf.Variable(tf.truncated_normal([1150, self._num_hidden], stddev=0.01))
        # embedding = tf.batch_matmul(data, embeds)
        embedding = tf.reshape(tf.matmul(tf.reshape(data,[-1,1150]),embeds,a_is_sparse=True),[-1,10,200])

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


if __name__ == '__main__':
    # We treat images as sequences of pixel rows.
    train_data = np.load("data.npy")
    train_labels = np.load("labels.npy")
    num_classes = 161
    data = tf.placeholder(tf.float32, [None, 10, 1150])
    target = tf.placeholder(tf.float32, [None, 161])
    dropout = tf.placeholder(tf.float32)

    model = SequenceClassification(data, target, dropout)
    sess = tf.Session()
    sess.run(tf.initialize_all_variables())

    saver = tf.train.Saver()

    print np.shape(train_data)
    for epoch in range(1000):
        for i in range(440):
            rand = i
            # rand = randint(0,6100)
            x = train_data[rand:rand+64,:,:]
            y = train_labels[rand:rand+64,:]
            sess.run(model.optimize, {data: x, target: y, dropout: 0.5})
            # print i
            if i % 50 == 0:
                error, co = sess.run([model.error, model.cost], {data: x, target: y, dropout: 1})
                print('Epoch {:2d} error {:3.1f}%  cost {:3.1f}'.format(epoch + 1, 100 * error, co))

        if epoch % 5 == 0:
            saver.save(sess, os.getcwd()+"/training/train",global_step=epoch)
