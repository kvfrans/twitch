import tensorflow as tf
import numpy as np
from random import randint
# from tensorflow.models.rnn import rnn

maxepoch = 4
maxmaxepoch = 13
learningrate = 1.0
batchsize = 40
initscale = 0.1
emojisize = 161

class PTBModel(object):
    def __init__(self, training):
        numlayers = 2
        numsteps = 20
        embedsize = 200
        keep_prob = 1.0
        maxgradnorm = 5
        vocabsize = 10000

        self.batchsize = batchsize
        self.numsteps = numsteps

        self.input_data = tf.placeholder(tf.int32, [batchsize, numsteps])
        self.targets = tf.placeholder(tf.int32, [batchsize, numsteps])

        lstm_cell = tf.nn.rnn_cell.BasicLSTMCell(embedsize, forget_bias=0.0)
        if training:
            lstm_cell = tf.nn.rnn_cell.DropoutWrapper(lstm_cell,keep_prob)
        cell = tf.nn.rnn_cell.MultiRNNCell([lstm_cell] * numlayers)

        self.initialstate = cell.zero_state(batchsize, tf.float32)

        with tf.device("/cpu:0"):
            embedding = tf.get_variable("embedding", [vocabsize, embedsize])
            inputs = tf.nn.embedding_lookup(embedding, self.input_data)

        if training:
            inputs = tf.nn.dropout(inputs, keep_prob)

        # print inputs.get_shape()
        inputs = [tf.squeeze(input_, [1]) for input_ in tf.split(1, numsteps, inputs)]
        # print inputs[0].get_shape()
        outputs, state = tf.nn.rnn(cell, inputs, initial_state=self.initialstate)
        # print outputs[0].get_shape()
        # print state.get_shape()

        output = tf.reshape(tf.concat(1, outputs), [-1, embedsize])
        # print output.get_shape()
        softmax_w = tf.get_variable("softmax_w",[embedsize, emojisize])
        softmax_b = tf.get_variable("softmax_b",[emojisize])
        logits = tf.matmul(output, softmax_w) + softmax_b
        loss = tf.nn.seq2seq.sequence_loss_by_example(
            [logits],
            [tf.reshape(self.targets, [-1])],
            [tf.ones([batchsize * numsteps])])
        self.cost = tf.reduce_sum(loss) / batchsize
        self.finalstate = state

        if not training:
            return

        self.lr = tf.Variable(0.0, trainable=False)
        tvars = tf.trainable_variables()
        grads, _ = tf.clip_by_global_norm(tf.gradients(self.cost, tvars), maxgradnorm)
        optimizer = tf.train.GradientDescentOptimizer(self.lr)
        self.trainop = optimizer.apply_gradients(zip(grads, tvars))

    def assign_lr(self, session, lr_value):
      session.run(tf.assign(self.lr, lr_value))

def run_epoch(session, m, data, eval_op):
  """Runs the model on the given data."""
  epoch_size = ((len(data) // m.batch_size) - 1) // m.num_steps
  start_time = time.time()
  costs = 0.0
  iters = 0
  state = m.initialstate.eval()
  for step in xrange(1000):
      rand = randint(0,50)
      x = train_data[rand:rand+batchsize,:]
      y = train_labels[rand:rand+batchsize,:]
      cost, state, _ = session.run([m.cost, m.final_state, eval_op],
                                 {m.input_data: x,
                                  m.targets: y,
                                  m.initial_state: state})
      costs += cost
      iters += m.num_steps

      if step % 10 == 0:
          print("%.3f perplexity: %.3f speed: %.0f wps" %
            (step * 1.0 / epoch_size, np.exp(costs / iters),
             iters * m.batch_size / (time.time() - start_time)))

  return np.exp(costs / iters)


with tf.Graph().as_default(), tf.Session() as session:
    initializer = tf.random_uniform_initializer(-initscale,initscale)
    with tf.variable_scope("model", reuse=None, initializer=initializer):
      m = PTBModel(training=True)
    with tf.variable_scope("model", reuse=True, initializer=initializer):
      mvalid = PTBModel(training=False)
      mtest = PTBModel(training=False)

      tf.initialize_all_variables().run()
      for i in xrange(maxmaxepoch):
          lr_decay = 0.5 ** max(i - maxepoch, 0.0)
          m.assign_lr(session, learningrate * lr_decay)

          train_perplexity = run_epoch(session, m, train_data, train_labels, m.trainop)
