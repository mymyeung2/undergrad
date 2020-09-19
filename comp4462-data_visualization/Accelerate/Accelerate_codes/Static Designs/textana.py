# Text Analysis Python 3 Program
# COMP 4462 Project 2020 Spring
# By: Yeung Man Yin Michael


MAX_RANK = 30
MAX_COMMON = 2
listin = []
excluding_set = set()
sublistin = dict()
subcountdict = dict()
exc = dict()


def readfile():
    fin = open("Uber_Ride_Reviews.csv")
    fin.readline()  # dump row 0
    listhere = []
    while True:
        try:
            line = fin.readline()
        except:
            break
        line = line.strip().split(",")
        if line[0] == "" or line[0] == " " or line[0] is None:
            break
        temprev = line[0].strip().split(" ")
        tempset = set()
        for word in temprev:
            tempset.add(word.lower())
        line[0] = tempset
        listhere.append(line)
    fin.close()
    return listhere


def readstopwords():
    fin2 = open("stopwords.txt")
    tempset = set()
    while True:
        try:
            line = fin2.readline()
            tempset.add(line.strip())
            if line == "z":
                break
        except:  # eof
            break
    print(tempset)
    fin2.close()
    return tempset


def countFreq(listhere):
    tempdict = dict()
    for row in listhere:
        for word in row[0]:
            if word not in tempdict.keys():
                tempdict[word] = 1
            else:
                tempdict[word] += 1
    return tempdict


def isExcluded(wordhere, excluded):
    for word in excluded:
        if wordhere == word:
            return True
    return False


def isStw(wordhere):
    if wordhere in stw:
        return True
    else:
        return False


def findMostFreq(dicthere, excluded_words):
    chosen_word = ["",0]
    for word in dicthere:
        if dicthere[word] > chosen_word[1] and not isExcluded(word, excluded_words) and not isStw(word):
            chosen_word = [word, dicthere[word]]
    return chosen_word


def genSublistin(listhere, rat):
    rev_list = []
    for item in listhere:
        if int(float(item[1])) == rat:
            rev_list.append(item)
    return rev_list


def getCommon(set1, set2, set3, set4, set5):
    commonSet = set()
    for item in set1.union(set2, set3, set4, set5):
        count = 0
        if item in set1:
            count += 1
        if item in set2:
            count += 1
        if item in set3:
            count += 1
        if item in set4:
            count += 1
        if item in set5:
            count += 1
        if count > MAX_COMMON:
            commonSet.add(item)
    return commonSet


# main
listin = readfile()
print("FINISH READFILE")
stw = readstopwords()
print("FINISH READ STOPWORDS")
countdict = countFreq(listin)
print("LISTIN", listin)
for rating in range(1, 6):
    sublistin[rating] = genSublistin(listin, rating)
    subcountdict[rating] = countFreq(sublistin[rating])


print("\nGENERAL FREQUENCY RANK:")
for rank in range(1, MAX_RANK + 1):
    ranked_word = findMostFreq(countdict, excluding_set)
    excluding_set.add(ranked_word[0])
    print(rank, ranked_word, round(ranked_word[1]/len(listin)*100, 2), "%")


print("\nFREQUENCY RANK BY RATING:")
for rating in range(1,6):
    print("RATING =", rating)
    excluding_set.clear()
    for rank in range(1, MAX_RANK + 1):
        ranked_word = findMostFreq(subcountdict[rating], excluding_set)
        excluding_set.add(ranked_word[0])
        print(rank, ranked_word, round(ranked_word[1]/len(sublistin[rating])*100, 2), "%")
    exc[rating] = excluding_set.copy()


print("\n")
new_exc_set = set()
exc_intersection = getCommon(exc[1], exc[2], exc[3], exc[4], exc[5])
print("Pruned:", exc_intersection)
prune = 1
while True:
    for rating in range(1, 6):
        new_exc_set.clear()
        excluding_set = exc_intersection
        for rank in range(1, MAX_RANK + 1):
            ranked_word = findMostFreq(subcountdict[rating], excluding_set.union(new_exc_set))
            new_exc_set.add(ranked_word[0])
        exc[rating] = new_exc_set.copy()
    exc_intersection_new = getCommon(exc[1], exc[2], exc[3], exc[4], exc[5])
    if len(exc_intersection_new) == 0:
        break
    print("Pruned:", exc_intersection_new)
    exc_intersection = exc_intersection.union(exc_intersection_new).copy()
    prune += 1
print("\nFREQUENCY RANK BY RATING, EXCLUDING WORDS FREQUENT IN MORE THAN", MAX_COMMON, "RATINGS:")
print("ie.", exc_intersection)
print("Number of Prunes:", prune)
for rating in range(1,6):
    print("RATING =", rating)
    excluding_set = exc_intersection.copy()
    for rank in range(1, MAX_RANK + 1):
        ranked_word = findMostFreq(subcountdict[rating], excluding_set)
        excluding_set.add(ranked_word[0])
        print(rank, ranked_word, round(ranked_word[1]/len(sublistin[rating])*100, 2), "%")


# print("CSV Format")
# for rating in range(1,6):
    # print("RATING =", rating)
    # excluding_set = exc_intersection.copy()
    # for rank in range(1, MAX_RANK + 1):
        # ranked_word = findMostFreq(subcountdict[rating], excluding_set)
        # excluding_set.add(ranked_word[0])
        # print(ranked_word[1],",",ranked_word[0])
