/*-----------------------------------------------------------------------------
This Bot uses the Bot Connector Service but is designed to showcase whats 
possible on Skype using the framework. The demo shows how to create a looping 
menu, how send things like Pictures, Hero & Thumbnail Cards, Receipts, and use 
Carousels. It alsoshows all of the prompts supported by Bot Builder and how to 
recieve uploaded photos and videos.

# RUN THE BOT:

    You can run the bot locally using the Bot Framework Emulator but for the best
    experience you should register a new bot on Facebook and bind it to the demo 
    bot. You can run the bot locally using ngrok found at https://ngrok.com/.

    * Install and run ngrok in a console window using "ngrok http 3978".
    * Create a bot on https://dev.botframework.com and follow the steps to setup
      a Skype channel.
    * For the endpoint you setup on dev.botframework.com, copy the https link 
      ngrok setup and set "<ngrok link>/api/messages" as your bots endpoint.
    * In a separate console window set MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD
      and run "node app.js" from the example directory. You should be ready to add 
      your bot as a contact and say "hello" to start the demo.

-----------------------------------------------------------------------------*/

var fs = require('fs');
var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');

process.env.MICROSOFT_APP_ID = "edd77ebf-5503-4327-ab24-fbd5cbd76c75";
process.env.MICROSOFT_APP_PASSWORD = "gtZcFtGcgGWMZYsS4LoMf36";
  
// Create bot and setup server
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', connector.verifyBotFramework(), connector.listen());
server.listen(process.env.port || 8000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});



bot.on('conversationUpdate', function (message) {
   // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                            .address(message.address)
                            .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('typing', function (message) {
    console.log("typing")
});

bot.on('deleteUserData', function (message) {
    console.log("delete");
});


bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));


bot.dialog('/', [
    function (session) {
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm the Microsoft Bot Framework demo bot for Skype. I can show you everything you can use our Bot Builder SDK to do on Skype.");
        session.beginDialog('/menu');
    },
    function (session, results) {
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|(quit)");
    },
    function (session, results) {
        if (results && results.response) {
            session.send("You entered '%s'", results.response);
            post(results.response, function(){
                bot.dialog('/picture')
            })
        }
    },    
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
])

bot.dialog('/picture', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
    }
]);


function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

function post(text,callback){
    translateText(text,function(){  
        request({
            url:"https://google.com",
                method:"POST",json:true},
            function(error,response,body){
                if(error){
                    console.log("error " + error)
                    return
                }
                console.log("this is what array iss supposed to be" + body)
                sketchglobalthing2 = body
                return body
            }
        );
    });
    callback()
}
