# Twitch chat simulator using recurrent neural networks

Ever watched a twitch stream and wished you could get more of the chat spam, copypasta, and memes?

This code goes along with [my post](http://kvfrans.com/simulating-twitch-chat-with-a-recurrent-neural-network/) about language modeling using recurrent neural networks. The post puts a focus on data collection, sanitization, and formatting to move data from the Twitch IRC into a tensorflow-compatible format.

Live demo available on [the post](http://kvfrans.com/simulating-twitch-chat-with-a-recurrent-neural-network/) if you want to experiment with what the network thinks a typical Twitch user would say.

###How to run it

1. Edit `scrape.js` to supply your own Twitch IRC Token and username. You can get the oauth token from http://twitchapps.com/tmi/. Run `node scrape.js` to scrape messages from Twitch's IRC channels. Alternatively, you can also use the provided `database.txt` which I collected by running the scraper overnight for ~8 hours. Fill in the channels array with a list of streamers you want to scrape from.

2. Run `node topwords.js` to format a vocabulary dictionary (`words.json`) that maps IDs to each word that appeared at least five times.

3. Run `python arrays.py` to join `database.txt` and `words.json` into a numpy array representing each sentence as a vector of word IDs.

4. Run `python main.py` to train the network using Tensorflow. I left it running for about ~3 hours on a GPU to get the model in the live demo.

5. Use `sample.py` to sample messages from the model. `server.py` creates a simple web API to retrieve samples.
