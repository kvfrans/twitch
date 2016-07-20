import numpy as np
import json
import re

with open('database.txt') as data_file:
    sentences=data_file.read().replace('\n', '')

with open('words.json') as data_file:
    wordsdata = json.load(data_file)


count = 0

split_sentences = sentences.split("<eos>")

# 152401 sentences
# 33233 words
nparray = np.zeros((152401,20))

for s in xrange(len(split_sentences)):
    sentence = split_sentences[s].lower()
    regex = re.compile('[^0-9a-zA-Z ]')
    realsent = regex.sub('', sentence)
    words = sentence.split(" ")
    if len(words) >= 2:
        count = count + 1
        for w in xrange(min(len(words),20)):
            word = words[w]
            if word in wordsdata:
                nparray[count][w] = wordsdata[word]
            else:
                nparray[count][w] = 33234

nparray = nparray[:count,:]
print nparray.shape

np.random.shuffle(nparray)
np.save("data.npy",nparray)
