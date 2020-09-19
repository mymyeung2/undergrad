# constants
avoid_zero = 0.1
max_height = 6


# lists used in read file functions
listin = []
listin2 = []


# init dictionaries / given characteristics of data
pc = {"not_recom": 0, "recommend": 0, "very_recom": 0, "priority": 0, "spec_prior": 0}
sublists = {"not_recom": [], "recommend": [], "very_recom": [], "priority": [], "spec_prior": []}
attributes = ["parents", "has_nurs", "form", "children", "housing", "finance", "social", "health", "NURSERY"]
values = {"parents": ["usual", "pretentious", "great_pret"],
          "has_nurs": ["proper", "less_proper", "improper", "critical", "very_crit"],
          "form": ["complete", "completed", "incomplete", "foster"],
          "children": ["1", "2", "3", "more"],
          "housing": ["convenient", "less_conv", "critical"],
          "finance": ["convenient", "inconv"],
          "social": ["nonprob", "slightly_prob", "problematic"],
          "health": ["recommended", "priority", "not_recom"],
          "NURSERY": ["not_recom", "recommend", "very_recom", "priority", "spec_prior"]
          }


# read the file in, return a list of dicts
def readTrainingFile():
    fin = open("train.txt", "r")
    temp = fin.readline()  # dump the first line
    while True:
        line = fin.readline()
        if line == "":  # eof
            break
        line = line.strip().split(",")  # strip and split
        temp_dict = dict()
        j = 0  # index
        for i in attributes:
            temp_dict[i] = line[j]
            j += 1
        listin.append(temp_dict)  # contain dicts by list-in
    fin.close()
    return listin


def readTestingFile():
    fin2 = open("test.txt", "r")
    temp = fin2.readline()  # dump the first line
    while True:
        line = fin2.readline()
        if line == "":  # eof
            break
        line = line.strip().split(",")  # strip and split
        temp_dict = dict()
        j = 0  # index
        for i in attributes:
            if i == "NURSERY":
                continue
            temp_dict[i] = line[j]
            j += 1
        listin2.append(temp_dict)  # contain dicts by list-in
    fin2.close()
    return listin2


# return P(attr = value|Ci)
def findAttrProb(valuehere, itemhere, attrhere):
    count = 0
    for itemsublist in sublists[valuehere]:
        if itemsublist[attrhere] == itemhere[attrhere]:
            count += 1
    probhere = count / (len(sublists[valuehere]) + avoid_zero)
    return probhere


# return the prob of each class, P(X|Ci)
def findClassProb(valuehere, itemhere):
    prob = 1
    for attribute in attributes:
        if attribute == "NURSERY":
            break
        prob *= findAttrProb(valuehere, itemhere, attribute)
    return prob


# calculate P(Ci)
def calPc():
    for value in values["NURSERY"]:
        pc[value] = len(sublists[value]) / len(initial_list)
    return


# find the class with max prob
def findClass(itemhere):
    max_prob = [0, ""]
    for value in values["NURSERY"]:
        prob = findClassProb(value, itemhere) * pc[value]
        if prob > max_prob[0]:
            max_prob = [prob, value]
    return max_prob


# spawn dictionary "sublists" which contains all sub-lists
def spawnSublists(listhere):
    for value in values["NURSERY"]:
        for itemhere in listhere:
            if itemhere["NURSERY"] == value:
                sublists[value].append(itemhere)
    return


# main
# read files
initial_list = readTrainingFile()
test_list = readTestingFile()
# spawn sub-lists with each only contain one class
spawnSublists(initial_list)
calPc()
# find prob and print result
item_no = 1
for item in test_list:
    print("Test Instance", item_no, ":", findClass(item)[1])
    item_no += 1
