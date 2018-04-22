import psycopg2
import json
import os
from dotenv import load_dotenv

# Connect to an existing database
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
#conn = psycopg2.connect("dbname=niharikasingh user=niharikasingh")
# Open a cursor to perform database operations
cur = conn.cursor()

with open('dopeevalscomments.tsv') as cfile:
    for line in cfile:
        elements = line.split('\t')
        legacyid = elements[0]
        comment = elements[1]
        comment = comment.strip()

        #put in psql database
        try:
            cur.execute("UPDATE dopeevals SET comments=%s WHERE legacyid=%s", [comment, legacyid])
        except psycopg2.Error as e:
            print "---ERROR---"
            curQuery = "UPDATE dopeevals SET comments=%s WHERE legacyid=%s" %(comment, legacyid)
            print curQuery
            print e

# Close communication with the database
conn.commit()
cur.close()
conn.close()
