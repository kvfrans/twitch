import numpy as np
import json

with open('words.json') as data_file:
    data = json.load(data_file)

dict_length = len(data)
a = np.arange(dict_length)
print a
