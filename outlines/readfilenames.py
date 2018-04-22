# -*- coding: utf-8 -*-

import os
import json

#get all filenames
filenames = next(os.walk("outlines/"))[2]

#weird course names
replacements = {"14th-Amendment" : "Constitutional Law Separation of Powers, Federalism, and Fourteenth Amendment",
"American-Legal-History-17761865" : "American Legal History 1776 1865",
"Antitrust-Law-and-Economics---US": "Antitrust Law and Economics US",
"Antitrust-Law-and-Economics--International" : "Antitrust Law and Economics International",
"Antitrust-Law-and-Economics--US": "Antitrust Law and Economics US",
"Civil-Pro": "Civil Procedure",
"Communications-Law-%26-Social-Change": "Communications Law and Social Change",
"Comparative-Law-Why-Law%253F-Lessons-from-China": "Comparative-Law-Why-Law-Lessons-from-China",
"Comparative-LawWhy-Law-Lessons-from-China" : "Comparative-Law-Why-Law-Lessons-from-China",
"" : "Unknown",
"Copyright-and-Trademark-Litigation-TRO-to-the-Supreme-Court" : "Copyright-and-Trademark-Litigation",
"Crim" : "Criminal Law",
"Criminal" : "Criminal Law",
"Criminal-Investigations-%252F-Police-Practices-Fourth-Fifth-and-Sixth-Amendments":
"Criminal-Investigations-Police-Practices-Fourth-Fifth-and-Sixth-Amendments",
"Energy-Law-%26-Policy" : "Energy-Law-and-Policy",
"First" : "First Amendment",
"Fourteenth-Amendment": "Constitutional Law Separation of Powers, Federalism, and Fourteenth Amendment",
"Gender-Sexuality-%26-the-Law": "Gender-Sexuality-and-the-Law",
"International-Human-Rights-Law" : "International-Human-Rights",
"International-Humanitarian-Law%252FLaws-of-War": "International-Humanitarian-Law-Laws-of-War",
"International-Humanitarian-Law%2FLaws-of-War":"International-Humanitarian-Law-Laws-of-War",
"Introduction-to-American-Law-%28An%29": "Introduction-to-American-Law",
"Introduction-to-Finance-Concepts-3Week-Section": "Introduction-to-Finance-Concepts-3-Week-Section",
"Law-Economics-%26-Psychology":"Law-Economics-and-Psychology",
"Legisl": "Legislation and Regulation",
"Legislation-and": "Legislation and Regulation",
"M%26A":"MandA",
"M%26A-Workshop":"MandA-Workshop",
"-Torts" : "torts",
"international humanitarian law%2flaws of war":"international humanitarian law laws of war",
"sports and the law examining the legal history and evolution of america%5cs three %5cmajor league%5c sports mlb nfl and nba":"sports and the law examining the legal history and evolution of americas three major league sports mlb nfl and nba"}

p_replacements = {
"chacon":"chac%f3n",
"kennedyrandall":"kennedy",
"brucemann":"mann"
}

#filename format
#course-name_[outline/exam]_year-semester[optional]_grade[optional]_professor_randomword_id.format

randomWordList = []
outlineDict = {}

for fn in filenames:
    #don't want files with multiple formats
    if ((fn.count(".") > 1) or (fn.startswith('.'))):
        continue
    attributes = fn.split("_")

    #process courseName
    courseName = attributes[0]
    if (courseName[-2]=="-"):
        if (courseName[-1].isdigit()):
            courseName = courseName[:-2]
        else:
            courseName = courseName[:-1]
    # look in dictionary
    if (courseName in replacements):
        courseName = replacements[courseName]
    # remove dashes and colons and dots and -law
    courseName = courseName.replace('-', ' ')
    courseName = courseName.replace(':', '')
    courseName = courseName.replace('.', '')
    courseName = courseName.replace(',', '')
    # lower case everything
    courseName = courseName.lower()
    if ((len(courseName) > 4) and (courseName[-4:] == " law")):
        courseName = courseName[:-4]
    courseName = courseName.strip()
    professorLastName = attributes[-3]
    professorLastName = professorLastName.replace('-', ' ')
    professorLastName = professorLastName.lower()
    # look in dictionary
    if (professorLastName in p_replacements):
        professorLastName = p_replacements[professorLastName]
    #add course name, professor last name, and outline name to dictionary
    if (courseName not in outlineDict):
        outlineDict[courseName] = {professorLastName: [fn]}
    else:
        if (professorLastName not in outlineDict[courseName]):
            outlineDict[courseName][professorLastName] = [fn]
        else:
            outlineDict[courseName][professorLastName].append(fn)
    #create list of used random words
    randomWord = attributes[-2]
    randomWordList.append(randomWord)

randomWordList = list(set(randomWordList))

with open("outlineDict.json", "w") as writeJSONFile:
    json.dump(outlineDict, writeJSONFile, sort_keys=True, indent=4, separators=(',', ':'))

with open("randomWordList.json", "w") as writeRandom:
    json.dump(randomWordList, writeRandom, sort_keys=True, indent=4, separators=(',', ':'))
