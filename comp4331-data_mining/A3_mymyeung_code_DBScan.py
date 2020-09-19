# COMP 4331 Assignment 3
# DBScan


import matplotlib.pyplot as plt
import math

points_in = []
Eps = 5
MinPts = 10
cores = []


# data point class
class Point:
    def __init__(self, x, y, num):
        self.x = float(x)
        self.y = float(y)
        self.cluster = 0  # assigned number of cluster (0 means no cluster)
        self.type = 3  # types: 1=core, 2=border, 3=noise
        self.num = num  # assigned number of this point
        self.neighbors = set()

    def getX(self):
        return self.x

    def getY(self):
        return self.y

    def getCluster(self):
        return self.cluster

    def getType(self):
        return self.type

    def getNum(self):
        return self.num

    def getNeighbors(self):
        return self.neighbors

    def setCluster(self, cluster):
        self.cluster = cluster
        return

    def setType(self, type):
        self.type = type
        return

    def addNeighbor(self, num):
        self.neighbors.add(num)
        return


def readfiles():
    fin = open("a3dataset.txt", "r")
    num = 0
    while True:
        try:
            line = fin.readline().strip().split(",")
            temp = Point(line[0], line[1], num)
            points_in.append(temp)
            num += 1
        except:  # eof
            break
    fin.close()
    return


def isNeighbor(point1, point2):
    if euclidean(point1, point2) <= Eps:
        return True
    else:
        return False


def euclidean(point1, point2):
    x_dist = point1.getX() - point2.getX()
    y_dist = point1.getY() - point2.getY()
    return math.sqrt(math.pow(x_dist, 2) + math.pow(y_dist, 2))


def defineCore():
    for i in points_in:
        count = -1  # exclude self
        for j in points_in:
            if isNeighbor(i, j):
                count += 1
                i.addNeighbor(j.getNum())
                j.addNeighbor(i.getNum())
        if count >= MinPts:
            i.setType(1)
            cores.append(i.getNum())
    return


def defineBorder():
    for i in cores:
        for j in points_in:
            if isNeighbor(points_in[i], j) and j.getType() == 3:
                j.setType(2)
                break
    return


# recursively assign density-connected data points to a cluster
def defineCluster(num, name, exclusion):
    exclusion.add(num)
    points_in[num].setCluster(name)
    # optional printing below
    # print(points_in[num].getX(), ",", points_in[num].getY(), "assigned to cluster", name)
    if len(points_in[num].getNeighbors()) == 0 or exclusion == points_in[num].getNeighbors():
        return
    for nei in points_in[num].getNeighbors():
        if nei in exclusion:
            continue
        defineCluster(nei, name, exclusion)
    return


# start new clusters
def defineClusters():
    current_cluster = 1
    for num in cores:
        if points_in[num].getCluster() == 0:
            temp = set()
            defineCluster(num, current_cluster, temp)
            current_cluster += 1
    return


def plot():
    colormap = ["red", "green", "blue", "yellow", "orange", "purple", "brown", "cyan", "pink"]
    for point in points_in:
        if point.getCluster() == 0:  # outliers
            color = "black"
        else:
            color = colormap[(point.getCluster() - 1) % 9]
        plt.scatter(point.getX(), point.getY(), s=10, c=color)

    plt.title('DBScan')
    plt.savefig('DBScan.png')
    plt.show()
    return


readfiles()
print("Finish Readfiles")
defineCore()
print("Finish DefineCore")
defineBorder()
print("Finish DefineBorder")
defineClusters()
print("Finish DefineClusters")
plot()
print("Finish Plot")
