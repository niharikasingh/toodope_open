from PyPDF2 import PdfFileReader
import re
import os
import psycopg2

INDEXDICT = {

}
FLOATSDICT = {

}

QUESTIONSINEVAL = 21
CLEANCOURSENAME = re.compile(r'[^-\w /]*', re.U)
FOLDERNAME = "evals_S16"

# Connect to an existing database
conn = psycopg2.connect("dbname=niharikasingh user=niharikasingh")
# Open a cursor to perform database operations
cur = conn.cursor()

#get all filenames
filenames = next(os.walk(FOLDERNAME))[2]

def isFloat(i):
    try:
        if (len(i) != len(str(int(float(i))))):
            return True #float
        else:
            return False #int
    except:
        return False #str

print filenames
for fn in filenames:
    with open(FOLDERNAME+"/"+fn, "r") as pdfFile:
        print fn
        try:
            parsedPdfFile = PdfFileReader(pdfFile)
        except:
            print "ERROR READING PDF: " + fn
            continue
        contents = parsedPdfFile.getPage(0).extractText().split('\n')
        contents = [e for e in contents if e != u' ']
        floatsInContent = [e for e in contents if ((len(e) == 5) and isFloat(e))]
        if (len(floatsInContent) != QUESTIONSINEVAL):
            if (fn in FLOATSDICT):
                floatsInContent = FLOATSDICT[fn]
                print "fixed floats issue"
            else:
                print "WARNING: " + fn + " does not have 21 answers."
                print floatsInContent
                continue
        floatsInContent = [float(e) for e in floatsInContent]
        # get professor last name from file name
        profName = fn.split("/")[-1]
        profName = profName.split("_")[0]
        # profName = fn[:-9]
        profName = profName[0].lower() + profName[1:]
        if ('A' <= profName[-1] <= 'Z'):
            profName = profName[:-1]
        try:
            # get course name from file contents
            cInd = contents.index("Course Code:")
            courseName = contents[cInd+2].lower()
        except:
            print "Could not find course name of " + fn
            continue
        try:
            # number of students in course
            nInd1 = contents.index("Enrolled")
            numEnrolled = int(contents[nInd1-1])
            # number of students who filled out evals
            nInd2 = contents.index("Returned")
            numReturned = int(contents[nInd2-1])
            print "going into except block error fixed"
        except:
            if (fn in INDEXDICT):
                # get course name from file contents
                cInd = contents.index("Course Code:")
                courseName = contents[cInd+2].lower()
                numEnrolled = INDEXDICT[fn][0]
                numReturned = INDEXDICT[fn][1]
                print "indices error fixed"
            else:
                print "ERROR could not find all indices in " + fn
                continue

        courseName = CLEANCOURSENAME.sub('', courseName)
        print profName + " " + courseName + " " + str(numEnrolled) + " " + str(numReturned)
        #print floatsInContent
        #print courseName
        #put in psql database
        sem = "Spring"
        year = 2016
        executeQuery = "INSERT INTO hlsevals VALUES (DEFAULT, \'%s\', \'%s\', \'%s\', %d" %(profName, courseName, sem, year)
        for e in floatsInContent:
            executeQuery += ", %1.4f" %(e)
        executeQuery += ", %d, %d)" %(numEnrolled, numReturned)
        #print executeQuery
        # try:
        #     cur.execute(executeQuery)
        # except psycopg2.Error as e:
        #     print "ERROR: inserting into db"
        #     print executeQuery
# Close communication with the database
conn.commit()
cur.close()
conn.close()


# useful SQL
# UPDATE hlsevals set q6_rank = ttable.trank FROM ( SELECT rank() OVER (ORDER BY q6 DESC) AS trank, id FROM hlsevals ) AS ttable WHERE hlsevals.id = ttable.id;
# UPDATE hlsevals SET course = trim(course)
