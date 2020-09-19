# Price-distance Analysis Python 3 Program
# COMP 4462 Project 2020 Spring
# By: Yeung Man Yin Michael

import matplotlib.pyplot as plt
import numpy as np
arr0 = []
arr1 = []
arr2 = []
arr3 = []

def readfiles():
    count =0
    fin = open("price-distance.csv")
    temp = fin.readline()
    while True:
        try:
            line = fin.readline().strip().split(",")
            arr0.append(line[0])
            arr1.append(line[1])
            arr2.append(line[2])
            arr3.append(line[3])
            count+=1
            if line == ['']:
                break
        except:
            break

        print(line,count)
    return


readfiles()

for i in range(0,len(arr0)):
    if arr1[i] == "NA":
        continue
    if arr0[i] == "Uber":
        plt.scatter(float(arr2[i]), float(arr1[i]), s=2, c="blue")
    elif arr0[i] == "Lyft":
        plt.scatter(float(arr2[i]), float(arr1[i]), s=2, c="pink")
    print(i)

plt.title('Price against Distance')
plt.savefig('price-distance.png')
plt.show()



