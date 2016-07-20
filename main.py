import tensorflow as tf
import numpy as np

batchsize = 64
numsteps = 20
embedsize = 200
numlayers = 2
vocabsize = 33235
keep_prob = 0.5

input_data = tf.placeholder(tf.int32,[batchsize,numsteps])
targets = tf.placeholder(tf.int32,[batchsize,numsteps])
lstm_cell = tf.nn.rnn_cell.BasicLSTMCell(embedsize)
lstm_cell = tf.nn.rnn_cell.DropoutWrapper(lstm_cell,keep_prob)
cell = tf.nn.rnn_cell.MultiRNNCell([lstm_cell] * numlayers)

initialstate = cell.zero_state(batchsize, tf.float32)

with tf.variable_scope("rnnlm"):
    with tf.device("/cpu:0"):
        embedding = tf.get_variable("embedding", [vocabsize, embedsize])
        # inputs = tf.nn.embedding_lookup(embedding, input_data)
        # inputs = list of 20, each containing [64,200]
        inputs = tf.split(1, numsteps, tf.nn.embedding_lookup(embedding, input_data))
        inputs = [tf.squeeze(input_, [1]) for input_ in inputs]

    softmax_w = tf.get_variable("softmax_w", [embedsize, vocabsize])
    softmax_b = tf.get_variable("softmax_b", [vocabsize])

# loop_function: instead of using the actual sentence, start from the first word and generate the rest. dont do this in training
outputs, last_state = tf.nn.seq2seq.rnn_decoder(inputs, initialstate, cell, loop_function=None, scope='rnnlm')
# outputs: list(20), of [batchsize x outputsize], [64 x 200]
# outputs are word embeddings

# put all the timesteps/batches in one dimension
output = tf.reshape(tf.concat(1,outputs), [-1, embedsize])

# word embeddings to word probabilities
logits = tf.matmul(output, softmax_w) + softmax_b
probs = tf.nn.softmax(logits)

# target array flattened like we did for outputs
flat_targets = tf.reshape(targets, [-1])
# sequence by loss requires a weighting for each word, use tf.ones so they are all weighted equal
weights = tf.ones([batchsize * numsteps])
loss = tf.nn.seq2seq.sequence_loss_by_example([logits], [flat_targets], [weights])
cost = tf.reduce_sum(loss) / (batchsize * numsteps)
final_state = last_state
learningrate = tf.Variable(0.0, trainable=False)
tvars = tf.trainable_variables()
# makes gradients not get too huge and explode
grads, _ = tf.clip_by_global_norm(tf.gradients(cost, tvars), 5)
train_op = tf.train.AdamOptimizer(learningrate).apply_gradients(zip(grads, tvars))

data = np.load("data.npy")
num_batches = data.shape[0] / batchsize
# makes sure the data ends with a full batch
data = data [:num_batches*batchsize,:]
data = np.split(data,num_batches)
xdata = data
ydata = np.copy(data)
for i in xrange(num_batches):
    ydata[i][:,:-1] = xdata[i][:,1:]
    ydata[i][:,-1] = 0
print xdata[45].shape

with tf.Session() as sess:
    saver = tf.train.Saver()
    sess.run(tf.initialize_all_variables())
    for e in xrange(10):
        sess.run(tf.assign(learningrate, 0.005))
        for b in xrange(num_batches):
            train_loss, _ = sess.run([cost, train_op], feed_dict={input_data: xdata[b], targets: ydata[b]})
            print "%d: %f" % (b, train_loss)
            if b % 100 == 0:
                saver.save(sess, os.getcwd()+"/training/train",global_step=(e*10000 + b))
