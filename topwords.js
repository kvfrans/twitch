var topwords = {}
var jsonfile = require('jsonfile')

fs = require('fs')
fs.readFile('database.txt', 'utf8', function (err,data) {
    if (err) {
    return console.log(err);
    }

    data = data.toLowerCase();
    var sentences = data.split("<eos>");
    for(var s = 0; s < sentences.length; s++)
    {
        sentences[s].replace(/[^0-9a-zA-Z ]/g, '')
        var words = sentences[s].split(" ");
        for(var w = 0; w < words.length; w++)
        {
            //   console.log(words[w]);
            if(topwords[words[w]] == null)
            {
                topwords[words[w]] = 1;
            }
            else
            {
                topwords[words[w]] = topwords[words[w]] + 1;
                //   console.log(topwords[words[w]]);
            }
        }
    }

    var len = Object.keys(topwords).length;
    var thewords = Object.keys(topwords);
    for(var w = 0; w < len; w++)
    {
        if(topwords[thewords[w]] < 5)
        {
            // console.log(thewords[w]);
            delete topwords[thewords[w]];
            // w--;
        }
        else
        {
            topwords[thewords[w]] = w+1;
        }
    }

    jsonfile.writeFile("words.json", topwords, function (err) {
    // console.error(err)
    })

    jsonfile.writeFile("words.json", topwords, function (err) {
    // console.error(err)
    })

});
