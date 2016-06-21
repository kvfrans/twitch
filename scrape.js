var tmi = require("tmi.js")

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
    channels: ["#imaqtpie"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();


client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    for(var i = 0; i < emojis.count(); i++)
    {
        if(message.indexOf(emojis[i]) != -1)
        {
            console.log(emojis[i] + ": " + message);
        }
    }
});
