var jsonfile = require('jsonfile')
var file = 'words.json'
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
var topwords = {}

var getNthWord = function(string, n){
    var words = string.split(" ");
    return words[n];
}

var json = require('./data.json');
for(var i = 0; i < emojis.length; i++) {
    var body = json[emojis[i]].toString()
    var word_count = body.split(/\s+/).length
    // console.log("second word is " + getNthWord(body, 1));
    // console.log("second word is second".split("second").length-1);
    for(var i = 0; i < word_count; i++) {
        word = getNthWord(body, i).split(",").join("")
        if(word.length >= 3)
        {
            if(topwords[word] == null) { //not in the dict yet
                var occurences = body.split(word).length;
                topwords[word] = occurences;
            }
            else {
                var occurences = body.split(word).length;
                // console.log("NotLikeThis" + topwords[word]);
                topwords[word] = topwords[word] + occurences;
            }
        }
    }
}
console.log(Object.keys(topwords).length);
console.log(Object.keys(topwords)[0]);
for(var i = 0; i < Object.keys(topwords).length; i++) {
    if(topwords[Object.keys(topwords)[i]] <= 3) {
        delete topwords[Object.keys(topwords)[i]]
    }
    else if(Object.keys(topwords)[i].length < 3)
    {
        // console.log(Object.keys(topwords)[i])
        delete topwords[Object.keys(topwords)[i]]
    }
    else
    {
        console.log(Object.keys(topwords)[i])
    }
}

console.log("---")
console.log("1".length)
console.log(Object.keys(topwords)[0].length)
// console.log(Object.keys(topwords).length);
// for(var i = 0; i < Object.keys(topwords).length; i++) {
//   topwords[Object.keys(topwords)[i]] = i
// }
jsonfile.writeFile(file, topwords, function (err) {
  // console.error(err)
})
