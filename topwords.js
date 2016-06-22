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
    var body = json[emojis[i]].toString().toLowerCase().replace(/,/g , "").split(" ")
    var word_count = body.length
    // console.log("word count = " + word_count);
    // console.log("second word is " + getNthWord(body, 1));
    // console.log("second word is second".split("second").length-1);
    for(var j = 0; j < word_count; j++) {
        word = body[j]
        if(word.length >= 3) {
            if(topwords[word] == null) {
                topwords[word] = 1;
            }
            else {
                topwords[word] = topwords[word] + 1;
                console.log(topwords[word]);
            }
        }
    }
}
console.log("---")
console.log(Object.keys(topwords).length);
console.log(Object.keys(topwords)[0]);
var wordlist = Object.keys(topwords);
var wordlength = wordlist.length

for(var i = 0; i < wordlength; i++) {
    if(topwords[wordlist[i]] <= 5) {
        delete topwords[wordlist[i]]
    }
    else if(wordlist[i].length < 2)
    {
        // console.log(Object.keys(topwords)[i])
        delete topwords[wordlist[i]]
    }
    else
    {
        // console.log("what " +Object.keys(topwords)[i])
    }
}

console.log("---")
console.log(Object.keys(topwords)[0].length)
console.log(Object.keys(topwords).length);
for(var i = 0; i < Object.keys(topwords).length; i++) {
    topwords[Object.keys(topwords)[i]] = i
}
jsonfile.writeFile(file, topwords, function (err) {
  // console.error(err)
})
percentages = {}
total = 0
percent = 0
for(var i = 0; i < emojis.length; i++) {
    length = json[emojis[i]].length;
    percentage = (length / 28310.0) * 100
    percentages[emojis[i]] =  percentage
    total += length
    percent += percentage
}
// console.log(percentages);
console.log(total);
console.log(percent);
