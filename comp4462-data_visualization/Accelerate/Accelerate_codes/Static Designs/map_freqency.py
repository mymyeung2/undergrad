# Boston Uber Map Frequency Analysis Python 3 Program
# COMP 4462 Project 2020 Spring
# By: Yeung Man Yin Michael

MIN_HOUR = 0
MAX_HOUR = 24
locations = ["Back Bay", "Beacon Hill", "Boston University", "Fenway", "Financial District",
             "Haymarket Square", "North End", "North Station", "Northeastern University",
             "South Station", "Theatre District", "West End"]
freq = dict()
freqL = dict()
listout = []
listout2 = []


def readfiles():
    fin = open("rideshare_kaggle.csv", "r")
    temp = fin.readline()
    count1 = 0
    count2 = 0
    set1 = set()
    set2 = set()
    while True:
        try:
            line = fin.readline().strip().split(',')
            for item in range(0, len(line)):
                line[item] = line[item].strip("\"")
            if isUseful(line):
                if str(line[19]) == " Clear ":
                    print("a")
                    if line[8] not in freq[line[7]].keys():
                        freq[line[7]][line[8]] = 1
                    else:
                        freq[line[7]][line[8]] += 1
                    count1 += 1
                    if not tuple([line[3], line[4]]) in set1:
                        set1.add(tuple([line[3], line[4]]))
                elif str(line[19]) == " Rain ":
                    print("b")
                    if line[8] not in freqL[line[7]].keys():
                        freqL[line[7]][line[8]] = 1
                    else:
                        freqL[line[7]][line[8]] += 1
                    count2 += 1
                    if not tuple([line[3], line[4]]) in set2:
                        set2.add(tuple([line[3], line[4]]))
        except:
            break
    return [len(set1), len(set2), set1, set2]


def sum_freq():
    for i in range(0, len(locations)):
        templist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        templist2 =templist.copy()
        for j in range(i+1, len(locations)):
            templist[j] = freq[locations[i]][locations[j]]
            templist2[j] = freq[locations[j]][locations[i]]
        listout.append(templist)
        listout2.append(templist2)
    return


def isUseful(linehere):
    if MIN_HOUR <= int(linehere[2]) <= MAX_HOUR:
        return True
    else:
        return False


# main
for i in locations:
    freq[i] = dict()
    freqL[i] = dict()
    for j in locations:
        freq[i][j] = 0
        freqL[i][j] = 0
count = readfiles()
if count[0] == 0:
    count[0] = 1
if count[1] == 0:
    count[1] = 1
for i in locations:
    for j in locations:
        if i == j:
            continue
        if freq[i][j] != 0:
            print(i,j, "\n",int((freq[i][j] + freq[j][i]) / count[0]), int((freqL[i][j] + freqL[j][i]) / count[1]))


