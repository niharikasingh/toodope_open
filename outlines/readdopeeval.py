import re
import psycopg2

CLEANCOURSENAME = re.compile(r'[^-a-zA-Z0-9 /]*')
# Connect to an existing database
conn = psycopg2.connect("dbname=niharikasingh user=niharikasingh")
# Open a cursor to perform database operations
cur = conn.cursor()

with open("evals_F16/dopeevalserror.txt") as dopefile:
    for line in dopefile:
        #elem = line.strip().split("\t")
        if (line[0:5] == "ERROR"):
            continue
        templine = line.strip()
        templine = templine.strip('[]')
        templine = templine.split(', ')
        elem = [e.strip("'\"") for e in templine]
        for i in range(len(elem), 14):
            elem.append("")
        # if (len(elem) == 13):
        #     elem.append("")
        # if (len(elem) != 14):
        #     print "ERROR NOT 14 - "
        #     print elem
        #     continue
        #print elem
        legacyid = int(elem[0])
        course = elem[1].lower()
        course = CLEANCOURSENAME.sub('', course)
        professor = elem[2]
        professor = CLEANCOURSENAME.sub('', professor)
        interaction = 0
        interactiontext = elem[3].strip()
        if (interactiontext == "Cold calls"):
            interaction = 1
        elif (interactiontext == "Soft cold calls"):
            interaction = 2
        elif (interactiontext == "Volunteers"):
            interaction = 3
        elif (interactiontext == "Just lecture"):
            interaction = 4
        elif (interactiontext == "Panels"):
            interaction = 5
        feelings = 0
        feelingstext = elem[4].strip()
        if (feelingstext == "Glad it's over"):
            feelings = 1
        elif (feelingstext == "Glad I took it"):
            feelings = 2
        elif (feelingstext == "My favorite course at HLS"):
            feelings = 3
        elif (feelingstext == "No strong feelings"):
            feelings = 4
        laptops = 0
        laptopstext = elem[5].strip()
        if (laptopstext == "Laptops allowed"):
            laptops = 1
        elif (laptopstext == "Laptops not allowed"):
            laptops = 2
        elif (laptopstext == "Varies"):
            laptops = 3
        reading = 0
        readingtext = elem[6].strip()
        if (readingtext == "Barely any"):
            reading = 1
        elif (readingtext == "Less than average"):
            reading = 2
        elif (readingtext == "About average"):
            reading = 3
        elif (readingtext == "On the high side"):
            reading = 4
        elif (readingtext == "Excessive"):
            reading = 5
        exam = 0
        examtext = elem[7].strip()
        if (examtext == "Simple"):
            exam = 1
        elif (examtext == "Easier than normal"):
            exam = 2
        elif (examtext == "About average"):
            exam = 3
        elif (examtext == "Difficult"):
            exam = 4
        elif (examtext == "Extremely frustrating"):
            exam = 5
        attendance = 0
        attendancetext = elem[8].strip()
        if (attendancetext == "Not necessary and not enforced"):
            attendance = 1
        elif (attendancetext == "Helpful, but not required"):
            attendance = 2
        elif (attendancetext == "Helpful and emphasized"):
            attendance = 3
        elif (attendancetext == "Attendance was effectively graded"):
            attendance = 4
        success = 0
        successtext = elem[9].strip()
        if (successtext == "Class attendance"):
            success = 1
        elif (successtext == "Outlines"):
            success = 2
        elif (successtext == "The reading"):
            success = 3
        elif (successtext == "Other"):
            success = 4
        elif (successtext == "I have no idea"):
            success = 5
        difficulty = 0
        difficultytext = elem[10].strip()
        if (difficultytext == "Easier"):
            difficulty = 1
        elif (difficultytext == "About average"):
            difficulty = 2
        elif (difficultytext == "More difficult"):
            difficulty = 3
        grades = 0
        gradestext = elem[11].strip()
        if (gradestext == "Easy H"):
            grades = 1
        elif (gradestext == "Normal H/P distribution"):
            grades = 2
        elif (gradestext == "Strict curve with LPs"):
            grades = 3
        elif (gradestext == "Don't know"):
            grades = 4
        preferencing = 0
        preferencingtext = elem[12].strip()
        if (preferencingtext == "Open seats"):
            preferencing = 1
        elif (preferencingtext == "Preference low"):
            preferencing = 2
        elif (preferencingtext == "Preference high"):
            preferencing = 3
        elif (preferencingtext == "Must be top preference"):
            preferencing = 4
        elif (preferencingtext == "Don't know"):
            preferencing = 5
        inclusive = 0
        inclusivetext = elem[13].strip()
        if (inclusivetext == "Not at all"):
            inclusive = 1
        elif (inclusivetext == "Some"):
            inclusive = 2
        elif (inclusivetext == "When prompted"):
            inclusive = 3
        elif (inclusivetext == "Very much"):
            inclusive = 4
        try:
            cur.execute("INSERT INTO dopeevals VALUES (DEFAULT, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", [legacyid, course, professor, interaction, feelings, laptops, reading, exam, attendance, success, difficulty, grades, preferencing, inclusive])
        except:
            print "ERROR DB - "
            print elem

# Close communication with the database
conn.commit()
cur.close()
conn.close()
