import math
max_height = 5
listin = []
listin2 = []
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

class Node:
    def __init__(self, attribute, info, parent, listcur):
        self.attribute = attribute  # the attribute to split at this node
        self.parent = parent  # the parent node
        self.children = dict()  # dict{value: Child Node}
        self.info = info  # info before the split
        self.list = listcur  # current list of data before split
        self.bottom = True  # True: the Node has no children

    def getChildren(self):
        return self.children

    def getAttribute(self):
        return self.attribute

    def getParent(self):
        return self.parent

    def getInfo(self):
        return self.info

    def getList(self):
        return self.list

    def setInfo(self, info_here):
        self.info = info_here

    def addChild(self, value, node):
        self.children[value] = node
        return

    def getChildNode(self, value):
        return self.children[value]

    def isNotBottom(self):
        self.bottom = False
        return

    def isBottom(self):
        if self.bottom:
            return True
        else:
            return False

# list of dicts
# return the info of a given value
def getInfo(listhere):
    info = 0
    temp = 0
    for value in values["NURSERY"]:  # per value
        count = 0
        for item in listhere:  # count freq in list-here
            if item["NURSERY"] == value:
                count += 1
        if count != 0:
            temp = count / len(listhere)
            info += temp * math.log(temp, 2)
    return -info


# find the attribute with min info (ie. max gain)
# return a list [info, attribute]
def findAttribute(listhere):
    min_info = [1, ""]  # max gain, max gain attribute
    for attribute in attributes:  # per attribute
        if attribute == "NURSERY":
            break
        listcur = []  # contains items satisfy required value
        new_info = 0  # info of the current attribute
        gain = 0
        for value in values[attribute]:  # accumulate info of the current attribute
            listcur = []
            for item in listhere:
                if item[attribute] == value:
                    listcur.append(item)
            info_value = getInfo(listcur)
            weighting_value = len(listcur) / len(listhere)
            weighted_info_value = info_value * weighting_value
            new_info += weighted_info_value
        if new_info < min_info[0]:  # update the attribute with max gain
            min_info[0] = new_info
            min_info[1] = attribute
    return min_info


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


# get a new list of dicts from the old list, containing only dicts satisfying "attr: val = True"
def getListcur(old_list, attr, val):
    listcur = []
    for item in old_list:
        if item[attr] == val:
            listcur.append(item)
    return listcur


# create node objects with linkages (tree)
def spawnChildren(parent_node, height):
    if height > max_height:  # max tree height is reached
        return
    for value in values[parent_node.getAttribute()]:
        listcur = getListcur(parent_node.getList(), parent_node.getAttribute(), value)
        if len(listcur) == 0:
            continue
        attr = findAttribute(listcur)
        if attr[0] - parent_node.getInfo() == 0:  # continue if no more info is gained
            continue
        child = Node(attr[1], attr[0], parent_node, listcur)  # attr, info, parent, listcur
        parent_node.isNotBottom()
        parent_node.addChild(value, child)
        spawnChildren(child, height+1)  # recursively spawn children
    return


# return the class of a given data item, from the bottom-end of the tree
def findMaxClass(listcur):
    ret = ""
    max_count = 0
    for value in values["NURSERY"]:
        count = 0
        for item in listcur:
            if item["NURSERY"] == value:
                count += 1
        if count > max_count:
            ret = value
    return ret


# search for the class of a given data item
# use recursion to arrive to bottom end of the tree
def findClass(itemhere, node):
    if node.isBottom():
        return findMaxClass(node.getList())
    else:
        return findClass(itemhere, node.getChildNode(itemhere[node.getAttribute()]))


# main
initial_list = readTrainingFile()
attri = findAttribute(initial_list)
root = Node(attri[1], attri[0], None, initial_list)
spawnChildren(root, 0)  # first node, height = 0
test_list = readTestingFile()
num = 1
for item in test_list:
    print("Test Instance", num, ":", findClass(item, root))
    num += 1
