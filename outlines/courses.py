import json
import csv

output = []

with open('coursesS18.csv', encoding="ISO-8859-1") as datafile:
    csvreader = csv.reader(datafile)
    for line in csvreader:
        # Term,Course Title,Faculty,Credits,REG Type,JD Program Capacity,By Perm,Meeting Days,Start Time,End Time,Course Type,Notes,examtype,examday,examtimestart,examtimeend,prereq,#outlines,#exams,areas,exp/pr,professorrating,professorrating_percentile,courserating,courserating_percentile,hourstemp,hours,link

        regtype = line[4]

        if (regtype == 'ELEC'):
            term = line[0][4:]
            course = line[1]
            professor = line[2]
            credits = line[3]
            classsize = line[5]
            byperm = False
            if (classsize == 'By Perm'):
                classsize = ''
                byperm = True
            daysarr = [False, False, False, False, False]
            if ('M' in line[7]):
                daysarr[0] = True
            if ('T' in line[7]) and ('Th' not in line[7]):
                daysarr[1] = True
            if ('W' in line[7]):
                daysarr[2] = True
            if ('Th' in line[7]):
                daysarr[3] = True
            if ('F' in line[7]):
                daysarr[4] = True
            starttime = line[8]
            endtime = line[9]
            coursetype = line[10]
            examtype = line[12]
            examday = line[13]
            examstarttime = line[14]
            examendtime = line[15]
            prereq = False
            if (line[16] == 'Y'):
                prereq = True
            numoutlines = line[17]
            numexams = line[18]
            areasarr = [False]*18
            if ('bu' in line[19]):
                areasarr[0] = True
            if ('co' in line[19]):
                areasarr[1] = True
            if ('cr' in line[19]):
                areasarr[2] = True
            if ('di' in line[19]):
                areasarr[3] = True
            if ('em' in line[19]):
                areasarr[4] = True
            if ('en' in line[19]):
                areasarr[5] = True
            if ('fa' in line[19]):
                areasarr[6] = True
            if ('go' in line[19]):
                areasarr[7] = True
            if ('he' in line[19]):
                areasarr[8] = True
            if ('hu' in line[19]):
                areasarr[9] = True
            if ('ip' in line[19]):
                areasarr[10] = True
            if ('ic' in line[19]):
                areasarr[11] = True
            if ('lpt' in line[19]):
                areasarr[12] = True
            if ('lh' in line[19]):
                areasarr[13] = True
            if ('lp' in line[19]) and ('lpt' not in line[19]):
                areasarr[14] = True
            if ('pr' in line[19]):
                areasarr[15] = True
            if ('re' in line[19]):
                areasarr[16] = True
            if ('ta' in line[19]):
                areasarr[17] = True
            exp = False
            if ('exp' in line[20]):
                exp = True
            pr = False
            if ('pr' in line[20]):
                pr = True
            profrating = line[21]
            profpercentile = line[22]
            courserating = line[23]
            coursepercentile = line[24]
            hours = line[26]
            link = line[27]

            tempitem = {
                "term": term,
                "course": course,
                "professor": professor,
                "credits": credits,
                "classsize": classsize,
                "byperm": byperm,
                "days": daysarr,
                "starttime": starttime,
                "endtime": endtime,
                "coursetype": coursetype,
                "examtype": examtype,
                "examday": examday,
                "examstarttime": examstarttime,
                "examendtime": examendtime,
                "prereq": prereq,
                "numoutlines": numoutlines,
                "numexams": numexams,
                "areas": areasarr,
                "exp": exp,
                "pr": pr,
                "profrating": profrating,
                "profpercentile": profpercentile,
                "courserating": courserating,
                "coursepercentile": coursepercentile,
                "hours": hours,
                "link": link
            }
            output.append(tempitem)

print(json.dumps(output, indent=2))
