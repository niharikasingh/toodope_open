import json

with open('outlineDict.json') as outlineDictFile:
    outlineDict = json.load(outlineDictFile)

outlineCourseDict = {}
for course in outlineDict:
    outlineCourseDict[course] = []
    for professor in outlineDict[course]:
        outlineCourseDict[course].extend(outlineDict[course][professor])

outlineProfessorDict = {}
for course in outlineDict:
    for professor in outlineDict[course]:
        if professor not in outlineProfessorDict:
            outlineProfessorDict[professor] = []
        outlineProfessorDict[professor].extend(outlineDict[course][professor])

with open("outlineCourseDict.json", "w") as writeCourseFile:
    json.dump(outlineCourseDict, writeCourseFile, sort_keys=True, indent=4, separators=(',', ':'))
with open("outlineProfessorDict.json", "w") as writeProfessorFile:
    json.dump(outlineProfessorDict, writeProfessorFile, sort_keys=True, indent=4, separators=(',', ':'))
