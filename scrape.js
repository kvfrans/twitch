var tmi = require("tmi.js")
var fs = require('fs');


var options = {
    options: {
        debug: false
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "TacoExplosion",
        password: "oauth:l0utik6fryye3pcus4gpo6uje5ba7f"
    },
    channels: ["nalcs2",
    "tsm_dyrus",
    "flosd",
    "trick2g",
    "valkrin",
    "sjow",
    "hotform",
    "nl_kripp",
    "scarra",
    "wingsofdeath",
    "tsm_theoddone",
    "trumpsc",
    "nvidia",
    "c9sneaky",
    "itshafu",
    "frodan",
    "firebat",
    "iwilldominate",
    "meteos",
    "anniebot",
    "imaqtpie",
    "aphromoo",
    "riotgames"]
};

var client = new tmi.client(options);

client.connect();
var counter = 0;

var jsonfile = require('jsonfile')
var file = 'data.json'


var totalstring = ""

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;
    message = message.replace(/[^\w\s]/gi, '')
    message = message + "<eos>"
    totalstring += message
    console.log(message);

    counter++;
    if(counter % 200 == 0)
    {
    	fs.writeFile("database.txt", totalstring, function(err) {});
    }
});
