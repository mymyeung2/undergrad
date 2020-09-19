# COMP 4331 Assignment 3
# K-means Clustering


import matplotlib.pyplot as plt
import math


K_CONST = 9
data_in = dict()  # dict containing all datapoints, with values = cluster number
MAX = [0, 0]
MIN = [0, 0]
centriods = []


# scan the data set
# return a dict of {tuple(x,y): 0}
def readfiles():
    isFirst = True
    fin = open("a3dataset.txt", "r")
    datahere = tuple()
    ret = dict()
    while True:
        try:
            line = fin.readline()
            temp = line.strip().split(",")
            datahere = tuple([float(temp[0]), float(temp[1])])
            ret[datahere] = 0  # init means = 0
            if isFirst:  # init MAX, MIN
                MAX[0] = float(temp[0])
                MAX[1] = float(temp[1])
                MIN[0] = float(temp[0])
                MIN[1] = float(temp[1])
                isFirst = False
            else:  # update MAX, MIN if applicable
                if datahere[0] > MAX[0]:
                    MAX[0] = datahere[0]
                if datahere[1] > MAX[1]:
                    MAX[1] = datahere[1]
                if datahere[0] < MIN[0]:
                    MIN[0] = datahere[0]
                if datahere[1] < MIN[1]:
                    MIN[1] = datahere[1]
        except:  # eof
            break
    return ret


# find average value of all elements in a list
def average(listhere):
    sum = 0
    for item in listhere:
        sum += item
    return sum / len(listhere)


# return initial centroid (relatively far apart)
def init_centriod():
    centriods_here = []
    odd = 0
    for i in range(0, K_CONST):
        if odd == 0:
            y_coor = MIN[1]
        else:
            y_coor = MAX[1]
        partition_width = (MAX[0]-MIN[0]) / (K_CONST - 1)
        x_coor = MIN[0] + i * partition_width
        centriods_here.append([x_coor, y_coor])
        odd = 1 - odd  # switch odd / even
    print("INIT CENTRIOD:", centriods_here)
    return centriods_here


# update the cluster number of each data point
def update_means(centriods_here):
    for datapoint in data_in:
        data_in[datapoint] = closest_mean(datapoint, centriods_here)
    return


# return the cluster number of the closet centriod to a datapoint
def closest_mean(datapoint, centriods_here):
    closest = 0
    count = 0
    min_dist = euclidean(datapoint, centriods_here[0])
    for centriod in centriods:
        dist = euclidean(datapoint, centriod)
        if dist < min_dist:
            min_dist = dist
            closest = count
        count += 1
    return closest


# input 2 tuples, return euclidean distance
def euclidean(point1, point2):
    return math.sqrt((point1[0]-point2[0])*(point1[0]-point2[0]) + (point1[1]-point2[1])*(point1[1]-point2[1]))


# update the centriods wrt the new clusters
def update_centriods():
    for k in range(0, K_CONST):
        count = 0
        sum_x = 0
        sum_y = 0
        for datapoint in data_in:
            if data_in[datapoint] == k:
                sum_x += datapoint[0]
                sum_y += datapoint[1]
                count += 1
        if count != 0:
            centriods[k] = tuple([sum_x/count, sum_y/count])  # assign centriod as average of coordinates
    return


# main
data_in = readfiles()  # scan dataset and get a dict of datapoints
print("DATA IN:", data_in)
print("INIT MAX MIN:", MAX, MIN)
centriods = init_centriod()  # get the initial centriods


# update centriods until no change in centriods
old_centriods = []
while True:
    old_centriods = centriods.copy()
    update_means(centriods)  # update cluster number of all datapoints
    update_centriods()  # update centriods
    if centriods == old_centriods:
        break

print("DATA OUT:", data_in)

sse = 0  # sum of squared error
for datapoint in data_in:
    sse += math.pow(euclidean(datapoint, centriods[data_in[datapoint]]), 2)
print("SSE:", sse)

colormap = ["red", "green", "blue", "yellow", "orange", "purple", "brown", "cyan", "pink"]

for datapoint in data_in:
    # plot datapoints, available also to K>9 (reuse colors)
    plt.scatter(datapoint[0], datapoint[1], s=10, c=colormap[data_in[datapoint] % 9])

for k in range(0, K_CONST):
    plt.text(centriods[k][0], centriods[k][1], 'Cluster'+str(k+1), fontsize=10)

plt.title('K-means Clustering')
plt.savefig('K_means_clustering.png')
plt.show()
