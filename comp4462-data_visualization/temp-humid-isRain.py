# Temperature-Humidity Analysis Python 3 Program
# COMP 4462 Project 2020 Spring
# By: Yeung Man Yin Michael

import matplotlib.pyplot as plt
data_in = dict()


def readfiles():
    fin = open("temp_humid_isRain.csv","r")
    temp = fin.readline()
    while True:
        try:
            line = fin.readline().strip().split(",")
            if line == ['']:
                break
            if tuple(line) not in data_in.keys():
                data_in[tuple(line)] = 1
            else:
                data_in[tuple(line)] += 1
        except:
            break

        print(line)
    return


def isRain(strin):
    if strin in {" Drizzle "," Possible Drizzle "," Light Rain "," Rain "}:
        return True
    else:
        return False


def isCloudy(strin):
    if strin in {" Mostly Cloudy "," Partly Cloudy "," Overcast "}:
        return True
    else:
        return False


def plot():
    colormap = ["green", "green", "yellow", "orange", "red", "brown"]
    count = 0
    for entry in data_in.keys():
        count += 1
        cc = int(float(data_in[entry]) / 1000)
        print(cc)
        if cc > 5:
            cc = 5
        if isRain(entry[4]):
            plt.scatter(float(entry[3]), float(entry[5]), s=15, c=colormap[cc], marker="x")
        #elif isCloudy(entry[4]):
           # plt.scatter(float(entry[3]), float(entry[5]), s=10, c=colormap[cc], marker="^")
        else:
            plt.scatter(float(entry[3]), float(entry[5]), s=10, c=colormap[cc], marker=None)
        print("plot data", entry)
    plt.title('Frequencies: Humidity against Temperature,')
    plt.savefig('temp-humid.png')
    plt.show()
    print(count)


readfiles()
print("FINISH READ FILES")
plot()
