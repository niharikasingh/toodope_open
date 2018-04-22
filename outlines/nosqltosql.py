import psycopg2
import json
import os
from dotenv import load_dotenv

# Connect to an existing database
#conn = psycopg2.connect("dbname=niharikasingh user=niharikasingh")
dbConnStr = ""
if ('PGUSER' in os.environ):
    dbConnStr += "user=" + os.environ['PGUSER']
    dbConnStr += " dbname=" + os.environ['PGDATABASE']
    dbConnStr += " password=" + os.environ['PGPASSWORD']
    dbConnStr += " port=" + os.environ['PGPORT']
    dbConnStr += " host=" + 'toodope.cp34q5gi0b5f.us-east-1.rds.amazonaws.com'
else:
    load_dotenv('../.env')
    dbConnStr += "user=" + os.environ.get('PGUSER')
    dbConnStr += " dbname=" + os.environ.get('PGDATABASE')
    dbConnStr += " password=" + os.environ.get('PGPASSWORD')
    dbConnStr += " port=" + os.environ.get('PGPORT')
    dbConnStr += " host=" + 'toodope.cp34q5gi0b5f.us-east-1.rds.amazonaws.com'
conn = psycopg2.connect(dbConnStr)
# Open a cursor to perform database operations
cur = conn.cursor()

with open('outlineDict.json') as outlineDictFile:
    outlineDict = json.load(outlineDictFile)

seenIDs = []
gradeArray = ["DS", "H", "P", "LP"]
doctypeArray = ["Outline", "Exam"]
#course-name_[outline/exam]_year-semester[optional]_grade[optional]_professor_randomword_id.format
#optionals inserted in order: [outlines/exam] then [year-semester] then [grade]
for course in outlineDict:
    for professor in outlineDict[course]:
        for o in outlineDict[course][professor]:
            print o
            elems = o.split("_")
            T_id = int(elems[-1].split(".")[0])
            T_docname = o
            T_course = course
            T_professorlast = professor
            #T_hearts = 0
            #T_userhearts = []
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
            if (T_id not in seenIDs):
                #put in psql database
                try:
                    cur.execute("INSERT INTO outlinestable VALUES (%s, %s, %s, %s, 0, '{}', %s, %s, %s, %s, %s)", [T_id, T_docname, T_course, T_professorlast, T_grade, T_semester, T_year, T_doctype, T_random])
                    seenIDs.append(T_id)
                except psycopg2.Error as e:
                    print "---ERROR---"
                    curQuery = "INSERT INTO outlinestable VALUES (%d, %s, %s, %s, 0, '{}', %s, %s, %s, %s, %s)" %(T_id, T_docname, T_course, T_professorlast, T_grade, T_semester, str(T_year), T_doctype, T_random)
                    print curQuery
                    print e
            else:
                print "SEEN: " + o

# Close communication with the database
conn.commit()
cur.close()
conn.close()
