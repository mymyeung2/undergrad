# Temperature-Humidity Analysis Python 3 Program
# COMP 4462 Project 2020 Spring
# By: Yeung Man Yin Michael

import matplotlib.pyplot as plt
data_in = dict()


def readfiles():
    fin = open("temp_humid.csv")
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


def plot():
    colormap = ["green", "green", "yellow", "orange", "red", "brown"]
    count = 0
    for entry in data_in.keys():
        count += 1
        cc = int(float(data_in[entry]) / 1000)
        print(cc)
        if cc > 5:
            cc = 5
        plt.scatter(float(entry[3]), float(entry[4]), s=10, c=colormap[cc])
        print("plot data", entry)
    plt.title('Frequencies: Humidity against Temperature')
    plt.savefig('temp-humid.png')
    plt.show()
    print(count)


readfiles()
print("FINISH READ FILES")
plot()
