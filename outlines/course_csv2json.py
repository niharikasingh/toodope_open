import json

catalog = "S17.csv"
output = "S17.json"

with open(catalog, "r") as catalogFile:
    catalogList = catalogFile.readlines()

# remove whitespace, \n
catalogList = [x.strip() for x in catalogList]

classArr = catalogList[::2]
professorArr = catalogList[1::2]

# remove duplicates
classArr = list(set(classArr))
professorArr = list(set(professorArr))
totalDict = dict(classList = classArr, professorList = professorArr)

with open(output, "w") as writeFile:
    writeFile.write(json.dumps(totalDict))
