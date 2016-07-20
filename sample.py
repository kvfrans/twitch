import tensorflow as tf
import numpy as np
import os
import json

with open("words.json") as json_file:
    jsonfile = json.load(json_file)
    wordmap = dict((y,x) for x,y in jsonfile.iteritems())
    wordmap[0] = "-"
    wordmap[33234] = "<rare word>"

batchsize = 1
numsteps = 1
embedsize = 200
numlayers = 2
vocabsize = 33235
keep_prob = 0.0

input_data = tf.placeholder(tf.int32,[batchsize,numsteps])


lstm_cell = tf.nn.rnn_cell.BasicLSTMCell(embedsize)
cell = tf.nn.rnn_cell.MultiRNNCell([lstm_cell] * numlayers)
initialstate = cell.zero_state(batchsize, tf.float32)

with tf.variable_scope("rnnlm") as scope:
    with tf.device("/cpu:0"):
        embedding = tf.get_variable("embedding", [vocabsize, embedsize])
        inputs = tf.split(1, numsteps, tf.nn.embedding_lookup(embedding, input_data))
        inputs = [tf.squeeze(input_, [1]) for input_ in inputs]

    softmax_w = tf.get_variable("softmax_w", [embedsize, vocabsize])
    softmax_b = tf.get_variable("softmax_b", [vocabsize])

outputs, last_state = tf.nn.seq2seq.rnn_decoder(inputs, initialstate, cell, loop_function=None, scope='rnnlm')
output = tf.reshape(tf.concat(1,outputs), [-1, embedsize])
logits = tf.matmul(output, softmax_w) + softmax_b
final_state = last_state

sess = tf.InteractiveSession()
saver = tf.train.Saver(max_to_keep=3)
saver.restore(sess, tf.train.latest_checkpoint(os.getcwd()+"/training/"))

def predict(starter):
    state = cell.zero_state(batchsize, tf.float32).eval()
    starterwords = starter.split(" ")
    nextword = 0

    total = ""

    for word in starterwords:
        total += " " + word
        primer = np.zeros((1,1))
        if word in jsonfile:
            primer[:,:] = jsonfile[word]
        else:
            primer[:,:] = 33234
        guessed_logits, state = sess.run([logits, final_state], feed_dict={input_data: primer, initialstate: state})
        nextword = np.argmax(guessed_logits,1)[0]

    for i in xrange(100):
        total += " " + wordmap[nextword]
        primer = np.zeros((1,1))
        primer[:,:] = nextword
        guessed_logits, state = sess.run([logits, final_state], feed_dict={input_data: primer, initialstate: state})
        nextword = np.argmax(guessed_logits,1)[0]
        if nextword == 0:
            break

    return total

# print predict("this game is")
