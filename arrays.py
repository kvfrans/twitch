import numpy as np
import json

emojis = ["4Head",
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

with open('data.json') as data_file:
    data = json.load(data_file)

with open('words.json') as data_file:
    wordsdata = json.load(data_file)

dict_length = len(data)
a = np.arange(dict_length)
print a

count = 0
arr = np.zeros([28310,10,8089])
labels = np.zeros([28310,161])
for i in xrange(161):
    for k in data[emojis[i]]:

        # labels[count,:] = i
        # labels[count] = labelvec
        wordarray = np.zeros([10,8089], dtype=np.int)
        words = k.split()
        hadwords = False
        for l in xrange(min(10,len(words))):
            if words[l] in wordsdata:
                wordarray[l][wordsdata[words[l]]] = 1
                hadwords = True
        # print np.shape(word2d)

        if hadwords:
            arr[count] = wordarray
            labelvec = np.zeros([161])
            labelvec[i] = 1
            labels[count] = labelvec
            count += 1

print count

# print labels[800]
print arr[0]

np.random.shuffle(arr)
np.random.shuffle(labels)
np.save("data.npy", arr)
np.save("labels.npy", labels)
