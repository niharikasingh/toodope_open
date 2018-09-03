# -*- coding: utf-8 -*-

# cleans and uploads all files stored locally in uploaderrors

import boto3
from botocore.client import Config
from docx import Document
import random
from pdfrw import PdfReader, PdfWriter, IndirectPdfDict
import os
import json
import psycopg2
import sys
from dotenv import load_dotenv

dbConnStr = ""
s3 = None
if ('PGUSER' in os.environ):
    dbConnStr += "user=" + os.environ['PGUSER']
    dbConnStr += " dbname=" + os.environ['PGDATABASE']
    dbConnStr += " password=" + os.environ['PGPASSWORD']
    dbConnStr += " port=" + os.environ['PGPORT']
    dbConnStr += " host=" + os.environ['PGHOST']
else:
    load_dotenv('../.env')
    dbConnStr += "user=" + os.environ.get('PGUSER')
    dbConnStr += " dbname=" + os.environ.get('PGDATABASE')
    dbConnStr += " password=" + os.environ.get('PGPASSWORD')
    dbConnStr += " port=" + os.environ.get('PGPORT')
    dbConnStr += " host=" + os.environ.get('PGHOST')

BN = 'toodope'
LPREF = 'uploaderrors/'
index = 0
rwl = []
s3 = boto3.client('s3', 'us-east-2', config=Config(signature_version='s3v4'))
gradeArray = ["DS", "H", "P", "LP"]
doctypeArray = ["Outline", "Exam"]

def sendToDb(f):
    print dbConnStr
    conn = psycopg2.connect(dbConnStr)
    cur = conn.cursor()
    elems = f.split("_")
    T_id = int(elems[-1].split(".")[0])
    T_docname = f
    #process courseName
    courseName = elems[0]
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
    professorLastName = elems[-3]
    professorLastName = professorLastName.replace('-', ' ')
    professorLastName = professorLastName.lower()
    # look in dictionary
    if (professorLastName in p_replacements):
        professorLastName = p_replacements[professorLastName]
    T_course = courseName
    T_professorlast = professorLastName
    if (elems[3] in gradeArray):
        T_grade = elems[3]
    else:
        T_grade = None
    if (elems[2][0:2] == "20"):
        tempYearSemester = elems[2].split("-")
        T_year = int(tempYearSemester[0])
        if (len(tempYearSemester) == 2):
            T_semester = tempYearSemester[1]
        else:
            T_semester = None
    else:
        T_year = None
        T_semester = None
    if (elems[1] in doctypeArray):
        T_doctype = elems[1]
    else:
        T_doctype = None
    T_random = elems[-2]
    try:
        cur.execute("INSERT INTO outlinestable VALUES (%s, %s, %s, %s, 0, '{}', %s, %s, %s, %s, %s)", [T_id, T_docname, T_course, T_professorlast, T_grade, T_semester, T_year, T_doctype, T_random])
    except psycopg2.Error as e:
        print "---ERROR---"
        curQuery = "INSERT INTO outlinestable VALUES (%d, %s, %s, %s, 0, '{}', %s, %s, %s, %s, %s)" %(T_id, T_docname, T_course, T_professorlast, T_grade, T_semester, str(T_year), T_doctype, T_random)
        print curQuery
        print e
    conn.commit()
    cur.close()
    conn.close()

def cleanDocx(fn):
    print "Cleaning: " + fn
    document = Document(fn)
    core_properties = document.core_properties
    core_properties.author = ""
    core_properties.last_modified_by = ""
    newNameArray = fn.split("_")
    randomWord = random.choice(rwl)
    newName = "_".join(newNameArray[:-1]) + "_" + randomWord + "_" + str(index) + ".docx"
    print "Writing: " + newName
    document.save(newName)
    return newName

def cleanPdf(fn):
    print "Cleaning: " + fn
    document = PdfReader(fn)
    writer = PdfWriter()
    writer.trailer = document
    writer.trailer.Info.Author = ""
    writer.trailer.Info.Creator = ""
    newNameArray = fn.split("_")
    randomWord = random.choice(rwl)
    newName = "_".join(newNameArray[:-1]) + "_" + randomWord + "_" + str(index) + ".pdf"
    print "Writing: " + newName
    writer.write(newName)
    return newName

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
"sports and the law examining the legal history and evolution of america%5cs three %5cmajor league%5c sports mlb nfl and nba":"sports and the law examining the legal history and evolution of americas three major league sports mlb nfl and nba"
}

p_replacements = {
"chacon":"chac%f3n",
"kennedyrandall":"kennedyrl",
"brucemann":"mann"
}

############ MAIN FUNCTION ##############

def cleanscript(f):
    print "Processing file " + f
    global index
    with psycopg2.connect(dbConnStr) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT max(id) FROM outlinestable")
            index = cur.fetchone()[0] + 1
    global rwl
    with open("randomWordList.json", "r") as rwlf:
        rwl = json.load(rwlf)
    if ((f.count(".") != 1) or (f.startswith('.'))):
        return
    newF = LPREF + f
    cleanF = ""
    #don't want files with multiple formats
    if (newF[-5:] == ".docx"):
        print "Cleaning DOCX: " + newF
        cleanF = cleanDocx(newF)
    elif (newF[-4:] == ".pdf"):
        print "Cleaning PDF: " + newF
        cleanF = cleanPdf(newF)
    else:
        return

    s3.upload_file(cleanF, BN, cleanF[len(LPREF):])
    print "Uploading clean file " + cleanF
    os.remove(newF)
    os.remove(cleanF)
    sendToDb(cleanF[len(LPREF):])

############### main function runs script

allfiles = os.listdir('uploaderrors')
for f in allfiles:
    cleanscript(f)
