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
    channels: ["#tsm_bjergsen","tsm_dyrus","flosd","trick2g","valkrin","sjow", "hotform", "nl_kripp", "scarra", "wingsofdeath", "tsm_theoddone", "trumpsc", "nvidia"]
};


var emojis = ["4Head",
"AMPEnergy",
"AMPEnergyCherry",
"ANELE",
"ArgieB8",
"ArsonNoSexy",
"AsianGlow",
"AthenaPMS",
"BabyRage",
"BatChest",
"BCouch",
"BCWarrior",
"BibleThump",
"BiersDerp",
"BigBrother",
"BionicBunion",
"BlargNaut",
"bleedPurple",
"BloodTrail",
"BORT",
"BrainSlug",
"BrokeBack",
"BudBlast",
"BuddhaBar",
"BudStar",
"ChefFrank",
"cmonBruh",
"CoolCat",
"CorgiDerp",
"CougarHunt",
"DAESuppy",
"DalLOVE",
"DansGame",
"DatSheffy",
"DBstyle",
"deExcite",
"deIlluminati",
"DendiFace",
"DogFace",
"DOOMGuy",
"DoritosChip",
"duDudu",
"EagleEye",
"EleGiggle",
"FailFish",
"FPSMarksman",
"FrankerZ",
"FreakinStinkin",
"FUNgineer",
"FunRun",
"FutureMan",
"FuzzyOtterOO",
"GingerPower",
"GrammarKing",
"HassaanChop",
"HassanChop",
"HeyGuys",
"HotPokket",
"HumbleLife",
"ItsBoshyTime",
"Jebaited",
"JKanStyle",
"JonCarnage",
"KAPOW",
"Kappa",
"KappaClaus",
"KappaPride",
"KappaRoss",
"KappaWealth",
"Keepo",
"KevinTurtle",
"Kippa",
"Kreygasm",
"Mau5",
"mcaT",
"MikeHogu",
"MingLee",
"MKXRaiden",
"MKXScorpion",
"MrDestructoid",
"MVGame",
"NinjaTroll",
"NomNom",
"NoNoSpot",
"NotATK",
"NotLikeThis",
"OhMyDog",
"OMGScoots",
"OneHand",
"OpieOP",
"OptimizePrime",
"OSfrog",
"OSkomodo",
"OSsloth",
"panicBasket",
"PanicVis",
"PartyTime",
"PazPazowitz",
"PeoplesChamp",
"PermaSmug",
"PeteZaroll",
"PeteZarollTie",
"PicoMause",
"PipeHype",
"PJSalt",
"PJSugar",
"PMSTwin",
"PogChamp",
"Poooound",
"PraiseIt",
"PRChase",
"PunchTrees",
"PuppeyFace",
"RaccAttack",
"RalpherZ",
"RedCoat",
"ResidentSleeper",
"riPepperonis",
"RitzMitz",
"RuleFive",
"SeemsGood",
"ShadyLulu",
"ShazBotstix",
"ShibeZ",
"SmoocherZ",
"SMOrc",
"SMSkull",
"SoBayed",
"SoonerLater",
"SriHead",
"SSSsss",
"StinkyCheese",
"StoneLightning",
"StrawBeary",
"SuperVinlin",
"SwiftRage",
"TBCheesePull",
"TBTacoLeft",
"TBTacoRight",
"TF2John",
"TheRinger",
"TheTarFu",
"TheThing",
"ThunBeast",
"TinyFace",
"TooSpicy",
"TriHard",
"TTours",
"twitchRaid",
"TwitchRPG",
"UleetBackup",
"UncleNox",
"UnSane",
"VaultBoy",
"VoHiYo",
"Volcania",
"WholeWheat",
"WinWaker",
"WTRuck",
"WutFace",
"YouWHY"]
var client = new tmi.client(options);

// Connect the client to the server..
client.connect();


var data = {};

for(var i = 0; i < emojis.length; i++)
{
    data[emojis[i]] = [];
}

var counter = 0;

var jsonfile = require('jsonfile')
var file = 'data.json'



client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    var lastemote = "none";

    for(var i = 0; i < emojis.length; i++)
    {
        if(message.indexOf(emojis[i]) != -1)
        {
            message = message.split(emojis[i]).join("");

            lastemote = emojis[i];
        }
    }
    if(message.indexOf("\'" == -1 && message.indexOf("\"" == -1)))
    {
        if(lastemote != "none" && message.length > 3)
        {
            console.log(lastemote + ": " + message);
            // console.log("lastemote is " + lastemote);
            data[lastemote].push(message);
            // console.log(data);
            console.log(counter);
            if(counter % 50 == 0)
            {
                jsonfile.writeFile(file, data, function (err) {
                  // console.error(err)
                })
            }
            counter++;
        }
    }

});
