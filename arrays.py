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
arr = np.zeros([28310,10,2035])
labels = np.zeros([28310,161])
for i in xrange(161):
    for k in data[emojis[i]]:

        # labels[count,:] = i
        # labels[count] = labelvec
        wordarray = np.zeros([10,2035], dtype=np.int)
        words = k.split()
        hadwords = False
        for l in xrange(min(10,len(words))):
            word = words[l].lower()
            if word in wordsdata:
                wordarray[l][wordsdata[word]] = 1
                hadwords = True
        # print np.shape(word2d)

        if hadwords:
            arr[count] = wordarray
            labelvec = np.zeros([161])
            labelvec[i] = 1
            labels[count] = labelvec
            count += 1

print count
realarr = arr[:count]
print np.shape(arr)
print np.shape(realarr)

np.set_printoptions(threshold=np.nan)


reallabels = labels[:count]
print np.shape(labels)
print np.shape(reallabels)
# print labels[800]
print np.argmax(realarr[5000][0])
print np.argmax(reallabels[5000])

indextest = np.arange(count)

rng_state = np.random.get_state()
np.random.shuffle(realarr)
np.random.set_state(rng_state)
np.random.shuffle(reallabels)
np.random.set_state(rng_state)
np.random.shuffle(indextest)

shuffledindex = 0

for i in xrange(count):
    if indextest[i] == 5000:
        shuffledindex = i

print np.argmax(realarr[shuffledindex][0])
print np.argmax(reallabels[shuffledindex])

# np.save("data.npy", realarr)
# np.save("labels.npy", reallabels)
