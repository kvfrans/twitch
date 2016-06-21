var tmi = require("tmi.js")

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
});

var options = {
    options: {
        debug: true
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

    console.log(message);

    // Do your stuff.
});
